import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);
const TIMEOUT_MS = 5000; // 5 seconds max

export async function executeCodeGlobally(code, language, input) {
    const id = Date.now() + '_' + Math.floor(Math.random() * 1000);
    const tempDir = path.join(process.cwd(), 'temp_run');
    
    // Ensure temp directory exists
    try { await fs.access(tempDir); } catch { await fs.mkdir(tempDir); }

    const inputFile = path.join(tempDir, `${id}.in`);
    await fs.writeFile(inputFile, input || '');

    let result = { success: false, output: '', error: '', stderr: '' };
    
    try {
        if (language === 'javascript') {
            const fileName = `script_${id}.js`;
            const filePath = path.join(tempDir, fileName);
            await fs.writeFile(filePath, code);
            
            const command = `node ${filePath} < ${inputFile}`;
            result = await runCommand(command);
            
            await fs.unlink(filePath).catch(() => {});
            
        } else if (language === 'python') {
            const fileName = `script_${id}.py`;
            const filePath = path.join(tempDir, fileName);
            await fs.writeFile(filePath, code);
            
            const command = `python ${filePath} < ${inputFile}`;
            result = await runCommand(command);
            
            await fs.unlink(filePath).catch(() => {});
            
        } else if (language === 'java') {
            // Java requires the file name to precisely match the public class name
            const classMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
            const className = classMatch ? classMatch[1] : `Main_${id}`;
            const fileName = `${className}.java`;
            const filePath = path.join(tempDir, fileName);
            
            // If no public class, inject one
            let finalCode = code;
            if (!classMatch) {
                finalCode = `public class ${className} {\n${code}\n}`;
            }
            
            await fs.writeFile(filePath, finalCode);
            
            // Compile then run (cd into the dir so 'java ClassName' works cleanly)
            const command = `cd ${tempDir} && javac ${fileName} && java ${className} < ${inputFile}`;
            result = await runCommand(command);
            
            await fs.unlink(filePath).catch(() => {});
            await fs.unlink(filePath.replace('.java', '.class')).catch(() => {});
        } else {
            return { success: false, error: 'Unsupported language', stderr: '' };
        }
    } catch (err) {
        result.error = err.message || 'Execution Failed';
        result.stderr = err.stderr || result.error;
    } finally {
        await fs.unlink(inputFile).catch(() => {});
    }

    return result;
}

async function runCommand(command) {
    try {
        const { stdout, stderr } = await execAsync(command, { timeout: TIMEOUT_MS });
        return {
            success: true,
            output: stdout,
            error: '',
            stderr: stderr
        };
    } catch (error) {
        return {
            success: false,
            output: error.stdout || '',
            error: error.message,
            stderr: error.stderr || error.message
        };
    }
}
