import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/*
 * HEALTH & RESOURCE MONITORING API
 * Safeguards and railings for the system
 */

// Thresholds - alert when exceeded
const THRESHOLDS = {
  memoryUsedPercent: 85,    // Alert at 85% RAM used
  diskUsedPercent: 80,      // Alert at 80% disk used
  loadAverage: 1.5,         // Alert at 1.5x CPU cores
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'status';

  try {
    if (action === 'status') {
      // Get system metrics
      const [memInfo, diskInfo, loadInfo, uptimeInfo] = await Promise.all([
        execAsync("free -b | grep Mem | awk '{print $2,$3,$4,$7}'"),
        execAsync("df -B1 / | tail -1 | awk '{print $2,$3,$4,$5}'"),
        execAsync("cat /proc/loadavg"),
        execAsync("uptime -p"),
      ]);

      const [memTotal, memUsed, memFree, memAvail] = memInfo.stdout.trim().split(' ').map(Number);
      const [diskTotal, diskUsed, diskFree, diskPercent] = diskInfo.stdout.trim().split(' ');
      const [load1, load5, load15] = loadInfo.stdout.trim().split(' ').slice(0, 3).map(Number);
      const uptime = uptimeInfo.stdout.trim();

      const memUsedPercent = (memUsed / memTotal) * 100;
      const diskUsedPercent = parseInt(diskPercent);
      const cpuCores = 2; // We know this from earlier

      // Check for alerts
      const alerts = [];
      if (memUsedPercent > THRESHOLDS.memoryUsedPercent) {
        alerts.push({ type: 'memory', message: `RAM at ${memUsedPercent.toFixed(1)}% (threshold: ${THRESHOLDS.memoryUsedPercent}%)`, severity: 'warning' });
      }
      if (diskUsedPercent > THRESHOLDS.diskUsedPercent) {
        alerts.push({ type: 'disk', message: `Disk at ${diskUsedPercent}% (threshold: ${THRESHOLDS.diskUsedPercent}%)`, severity: 'warning' });
      }
      if (load1 > THRESHOLDS.loadAverage * cpuCores) {
        alerts.push({ type: 'cpu', message: `Load average ${load1} exceeds threshold`, severity: 'warning' });
      }

      // Check PM2 process
      let pm2Status = 'unknown';
      try {
        const pm2Info = await execAsync("pm2 jlist 2>/dev/null");
        const processes = JSON.parse(pm2Info.stdout);
        const drain = processes.find(p => p.name === 'drain');
        pm2Status = drain ? drain.pm2_env.status : 'not found';
        if (drain && drain.pm2_env.restart_time > 50) {
          alerts.push({ type: 'restarts', message: `High restart count: ${drain.pm2_env.restart_time}`, severity: 'info' });
        }
      } catch {}

      return NextResponse.json({
        success: true,
        healthy: alerts.filter(a => a.severity === 'warning').length === 0,
        timestamp: new Date().toISOString(),
        uptime,
        metrics: {
          memory: {
            totalGB: (memTotal / 1e9).toFixed(2),
            usedGB: (memUsed / 1e9).toFixed(2),
            freeGB: (memFree / 1e9).toFixed(2),
            availableGB: (memAvail / 1e9).toFixed(2),
            usedPercent: memUsedPercent.toFixed(1),
          },
          disk: {
            totalGB: (parseInt(diskTotal) / 1e9).toFixed(2),
            usedGB: (parseInt(diskUsed) / 1e9).toFixed(2),
            freeGB: (parseInt(diskFree) / 1e9).toFixed(2),
            usedPercent: diskUsedPercent,
          },
          cpu: {
            cores: cpuCores,
            load1min: load1,
            load5min: load5,
            load15min: load15,
          },
          pm2: pm2Status,
        },
        alerts,
        thresholds: THRESHOLDS,
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
