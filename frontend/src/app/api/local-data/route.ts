import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), '..', 'data');
    const answersPath = path.join(dataDir, 'answers.json');
    const findingsPath = path.join(dataDir, 'findings.json');

    const readJson = (filePath: string) => {
      try {
        if (fs.existsSync(filePath)) {
          return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
      } catch (e) {
        // file unreadable or malformed
      }
      return null;
    };

    return NextResponse.json({
      answers: readJson(answersPath) || {},
      findings: readJson(findingsPath) || {}
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
