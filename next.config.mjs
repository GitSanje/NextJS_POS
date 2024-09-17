/** @type {import('next').NextConfig} */
const nextConfig = {
    logging:{
        fetches:{
            fullUrl:true
        }
    },
    experimental:{
        // appDir: true,
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt','fs/promises']
    },

};

export default nextConfig;
