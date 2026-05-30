'use client';
import { useState } from 'react';

const SCRIPT = `--[[
  FREQ WORLD — StartWorld.lua
  Paste into ServerScriptService in Roblox Studio
  
  SETUP:
  1. Open Roblox Studio → New Place → Baseplate template
  2. In Explorer: ServerScriptService → New Script → paste this
  3. Create GamePasses in Creator Hub, paste IDs into CONFIG below
  4. Hit Play to test, then Publish

  MONETIZATION:
  - VIP Stage Access: $10 Robux (~$0.035 per sale, 35% to you)
  - FREQ Member glow: $25 Robux
  - Set both GamePass IDs in CONFIG then publish
]]

local CONFIG = {
  VIP_STAGE_PASS_ID   = 0,  -- Replace with GamePass ID from Creator Hub
  FREQ_MEMBER_PASS_ID = 0,  -- Replace with GamePass ID from Creator Hub
  BEAT_BPM = 128,
}

local Players = game:GetService("Players")
local MarketplaceService = game:GetService("MarketplaceService")
local Lighting = game:GetService("Lighting")
local TweenService = game:GetService("TweenService")

-- Build the venue
local function buildVenue()
  local venue = Instance.new("Folder"); venue.Name = "FREQVenue"; venue.Parent = workspace
  local floor = Instance.new("Part"); floor.Size = Vector3.new(120,0.1,100); floor.Position = Vector3.new(0,0,0); floor.Material = Enum.Material.SmoothPlastic; floor.BrickColor = BrickColor.new("Really black"); floor.Anchored = true; floor.Parent = venue
  local danceFloor = Instance.new("Part"); danceFloor.Name = "DanceFloor"; danceFloor.Size = Vector3.new(60,0.15,40); danceFloor.Position = Vector3.new(0,0.1,10); danceFloor.Material = Enum.Material.Glass; danceFloor.BrickColor = BrickColor.new("Black"); danceFloor.Reflectance = 0.8; danceFloor.Anchored = true; danceFloor.Parent = venue
  local stage = Instance.new("Part"); stage.Name = "Stage"; stage.Size = Vector3.new(40,1,20); stage.Position = Vector3.new(0,2,-35); stage.Material = Enum.Material.SmoothPlastic; stage.BrickColor = BrickColor.new("Dark grey"); stage.Anchored = true; stage.Parent = venue
  local booth = Instance.new("Part"); booth.Name = "DJBooth"; booth.Size = Vector3.new(10,3,4); booth.Position = Vector3.new(0,3.5,-37); booth.Material = Enum.Material.SmoothPlastic; booth.BrickColor = BrickColor.new("Really black"); booth.Anchored = true; booth.Parent = venue
  local screen = Instance.new("Part"); screen.Name = "BoothScreen"; screen.Size = Vector3.new(8,2.5,0.1); screen.Position = Vector3.new(0,4,-35.1); screen.Material = Enum.Material.Neon; screen.BrickColor = BrickColor.new("Bright violet"); screen.Anchored = true; screen.Parent = venue
  for _,side in ipairs({-20,20}) do
    local spk = Instance.new("Part"); spk.Size = Vector3.new(4,12,4); spk.Position = Vector3.new(side,6,-38); spk.Material = Enum.Material.SmoothPlastic; spk.BrickColor = BrickColor.new("Really black"); spk.Anchored = true; spk.Parent = venue
    local grill = Instance.new("Part"); grill.Name = "SpeakerGrill"; grill.Size = Vector3.new(3.5,10,0.2); grill.Position = Vector3.new(side,6,-36.1); grill.Material = Enum.Material.Neon; grill.BrickColor = BrickColor.new("Bright violet"); grill.Transparency = 0.5; grill.Anchored = true; grill.Parent = venue
  end
  local rope = Instance.new("Part"); rope.Name = "VIPBarrier"; rope.Size = Vector3.new(42,2,0.3); rope.Position = Vector3.new(0,1.5,-22); rope.BrickColor = BrickColor.new("Gold"); rope.Anchored = true; rope.CanCollide = true; rope.Parent = venue
  print("[FREQ] Venue built.")
end

-- Lighting
local function setupLighting()
  Lighting.Ambient = Color3.fromHex("#000000"); Lighting.Brightness = 0; Lighting.ClockTime = 0
  local bloom = Instance.new("BloomEffect"); bloom.Intensity = 1.5; bloom.Size = 24; bloom.Threshold = 0.95; bloom.Parent = Lighting
  local cc = Instance.new("ColorCorrectionEffect"); cc.Contrast = 0.3; cc.Saturation = 0.5; cc.TintColor = Color3.fromHex("#9933ff"); cc.Parent = Lighting
  print("[FREQ] Lighting set.")
end

-- Beat pulse
local function startBeatLoop()
  local beatInterval = 60 / CONFIG.BEAT_BPM
  local neonColors = {Color3.fromHex("#ff00ff"),Color3.fromHex("#9933ff"),Color3.fromHex("#00ffff"),Color3.fromHex("#ff3399")}
  local beatCount = 0
  spawn(function()
    while true do
      wait(beatInterval); beatCount = beatCount + 1
      local col = neonColors[((beatCount-1) % #neonColors)+1]
      local df = workspace.FREQVenue:FindFirstChild("DanceFloor")
      if df then TweenService:Create(df,TweenInfo.new(beatInterval*0.2),{Color=col,Reflectance=0.95}):Play() end
      for _,obj in ipairs(workspace.FREQVenue:GetChildren()) do
        if obj.Name == "SpeakerGrill" then TweenService:Create(obj,TweenInfo.new(beatInterval*0.1),{Color=col,Transparency=0.1}):Play() end
      end
    end
  end)
  print("[FREQ] Beat loop at "..CONFIG.BEAT_BPM.." BPM")
end

-- GamePasses
local function setupGamePasses()
  local barrier = workspace.FREQVenue:FindFirstChild("VIPBarrier")
  if barrier then
    barrier.Touched:Connect(function(hit)
      local player = Players:GetPlayerFromCharacter(hit.Parent)
      if not player or CONFIG.VIP_STAGE_PASS_ID == 0 then return end
      local ok,has = pcall(function() return MarketplaceService:UserOwnsGamePassAsync(player.UserId, CONFIG.VIP_STAGE_PASS_ID) end)
      if ok and not has then MarketplaceService:PromptGamePassPurchase(player, CONFIG.VIP_STAGE_PASS_ID) end
    end)
  end
  Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(char)
      wait(1)
      if CONFIG.FREQ_MEMBER_PASS_ID == 0 then return end
      local ok,has = pcall(function() return MarketplaceService:UserOwnsGamePassAsync(player.UserId, CONFIG.FREQ_MEMBER_PASS_ID) end)
      if ok and has then
        for _,part in ipairs(char:GetDescendants()) do
          if part:IsA("BasePart") and part.Name ~= "HumanoidRootPart" then
            local sel = Instance.new("SelectionBox"); sel.Color3 = Color3.fromHex("#9933ff"); sel.LineThickness = 0.05; sel.Adornee = part; sel.Parent = char
          end
        end
      end
    end)
  end)
end

-- Leaderboard
Players.PlayerAdded:Connect(function(player)
  local ls = Instance.new("Folder"); ls.Name = "leaderstats"; ls.Parent = player
  local st = Instance.new("IntValue"); st.Name = "Stage Time"; st.Value = 0; st.Parent = ls
  spawn(function()
    while player.Parent do
      wait(1)
      local char = player.Character
      if char then
        local hrp = char:FindFirstChild("HumanoidRootPart")
        if hrp then
          local pos = hrp.Position
          if pos.X > -20 and pos.X < 20 and pos.Z > -45 and pos.Z < -22 then st.Value = st.Value + 1 end
        end
      end
    end
  end)
end)

-- Init
print("[FREQ] Starting...")
buildVenue(); setupLighting(); startBeatLoop(); setupGamePasses()
print("[FREQ] Ready. 〰️")
print("[FREQ] Next: Add GamePass IDs to CONFIG at top, then Publish")`;

export default function RobloxPage() {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(SCRIPT).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#e8e0d0', fontFamily:'monospace', padding:24 }}>
      <div style={{ fontSize:11, letterSpacing:'.35em', color:'rgba(232,224,208,.4)', marginBottom:24 }}>
        ← <a href="/ops-hub" style={{ color:'inherit', textDecoration:'none' }}>OPS HUB</a> / ROBLOX
      </div>
      <div style={{ fontSize:28, fontWeight:700, marginBottom:4 }}>FREQ World — Roblox</div>
      <div style={{ fontSize:12, color:'rgba(232,224,208,.4)', marginBottom:24 }}>StartWorld.lua · Paste into ServerScriptService in Studio</div>

      <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:12, padding:20, marginBottom:16 }}>
        <div style={{ fontSize:10, letterSpacing:'.2em', color:'rgba(232,224,208,.4)', marginBottom:12 }}>SETUP STEPS</div>
        {['1. Open Roblox Studio → New Place → Baseplate template',
          '2. In Explorer: ServerScriptService → New Script → paste script below',
          '3. Create 2 GamePasses in Creator Hub (VIP Stage + FREQ Member)',
          '4. Paste GamePass IDs into CONFIG at top of script',
          '5. Hit Play to test → Publish'
        ].map((s,i) => <div key={i} style={{ fontSize:12, color:'#e8e0d0', padding:'6px 0', borderBottom:'1px solid #1a1a1a' }}>{s}</div>)}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ fontSize:11, letterSpacing:'.2em', color:'rgba(232,224,208,.4)' }}>StartWorld.lua</div>
        <button onClick={copy} style={{
          background: copied ? '#00ff8822' : '#9933ff22', color: copied ? '#00ff88' : '#9933ff',
          border: '1px solid ' + (copied ? '#00ff8844' : '#9933ff44'),
          borderRadius:8, padding:'6px 16px', cursor:'pointer', fontSize:11, fontFamily:'monospace', letterSpacing:'.1em',
        }}>{copied ? '✓ Copied' : 'Copy Script'}</button>
      </div>

      <pre style={{
        background:'#0d0d0d', border:'1px solid #1e1e1e', borderRadius:8, padding:16,
        fontSize:10, lineHeight:1.6, overflowX:'auto', color:'rgba(232,224,208,.7)',
        maxHeight:400, overflowY:'auto',
      }}>{SCRIPT}</pre>
    </div>
  );
}
