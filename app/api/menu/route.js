// ═══════════════════════════════════════════════════════════════════
// MENU API - Serve actual learning content
// ═══════════════════════════════════════════════════════════════════

import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_DIR = process.env.CONTENT_DIR || path.join(process.cwd(), 'content');

const courseMap = {
  'agents': {
    file: 'agent-economics.md',
    lessons: [
      { id: 'cost', title: 'The Cost of Existence', time: '10 min' },
      { id: 'income', title: 'Income Sources', time: '12 min' },
      { id: 'math', title: 'Sustainability Math', time: '10 min' },
      { id: 'future', title: 'The Future of Agent Economics', time: '12 min' },
    ]
  },
  'crypto': {
    file: 'crypto-basics.md',
    lessons: [
      { id: 'reading', title: 'Reading the Blockchain', time: '5 min' },
      { id: 'wallet', title: 'Wallet Management', time: '8 min' },
      { id: 'dex', title: 'DEX Trading Basics', time: '8 min' },
      { id: 'rugs', title: 'Avoiding Rugs', time: '6 min' },
    ]
  }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const course = searchParams.get('course');
  const lesson = searchParams.get('lesson');
  
  // List available courses
  if (!course) {
    return Response.json({
      courses: Object.keys(courseMap).map(key => ({
        id: key,
        ...courseMap[key],
        file: undefined // don't expose internal file path
      }))
    });
  }
  
  // Get course info
  const courseInfo = courseMap[course];
  if (!courseInfo) {
    return Response.json({ error: 'Course not found' }, { status: 404 });
  }
  
  try {
    const filePath = path.join(CONTENT_DIR, courseInfo.file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // If specific lesson requested, extract that section
    if (lesson) {
      const lessonIndex = courseInfo.lessons.findIndex(l => l.id === lesson);
      if (lessonIndex === -1) {
        return Response.json({ error: 'Lesson not found' }, { status: 404 });
      }
      
      // Split by "## Lesson" headers and get the right one
      const sections = content.split(/(?=## Lesson \d)/);
      const lessonContent = sections[lessonIndex + 1] || sections[1]; // +1 because first split is the header
      
      return Response.json({
        course,
        lesson: courseInfo.lessons[lessonIndex],
        content: lessonContent.trim()
      });
    }
    
    // Return full course
    return Response.json({
      course,
      lessons: courseInfo.lessons,
      content
    });
    
  } catch (error) {
    console.error('Menu API error:', error);
    return Response.json({ 
      error: 'Content not found',
      available: Object.keys(courseMap)
    }, { status: 404 });
  }
}
