/** @type {import('next').NextConfig} */
const nextConfig = {
    logging:{
        fetches:{
            fullUrl:true
        }
    },
    experimental:{
        // appDir: true,
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt','fs/promises'],
        serverActions:{
            bodySizeLimit: '6mb'
        }
    },
    images:{
        domains: ['images.pexels.com'],
    }

};

export default nextConfig;
