/** @type {import('next').NextConfig} */
const nextConfig = {
    logging:{
        fetches:{
            fullUrl:true
        }
    },
    experimental:{
        // appDir: true,
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
    },

};

export default nextConfig;
