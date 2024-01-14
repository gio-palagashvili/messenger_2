import { writeFile } from 'fs/promises';
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export const POST = async (req: Request, res: NextApiResponse) => {
    try {
        const data = await req.formData()
        const file: File | null = data.get('file') as unknown as File

        if (!file) {
            return NextResponse.json({ success: false })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const path = `./public/${file.name}`
        await writeFile(path, buffer)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        return new Response(error.message);
    }
}