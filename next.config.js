

/** @type {import('next').NextConfig} */
const nextConfig = {
    logging:{
        fetches:{
            fullUrl:true
        }
    },
    serverExternalPackages: ['@prisma/client', 'bcrypt','fs/promises','fs'],

    experimental:{
        
        appDir: true,
        // incrementalCacheHandlerPath: require.resolve('./app/lib/cache-handler'),
        
        serverActions:{
            bodySizeLimit: '6mb'
        }
    },
    
    images:{
        domains: ['images.pexels.com', 'lh3.googleusercontent.com'],
        formats:['image/avif', 'image/webp'],
    }

};

// Use dynamic `import.meta.resolve` to handle module paths for ES modules
// export const CacheHandler = import.meta.resolve('./cache-handler.mjs');

// export default nextConfig;

module.exports = nextConfig



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     logging: {
//         fetches: {
//             fullUrl: true
//         }
//     },
//     experimental: {
//         // appDir: true,
//         // incrementalCacheHandlerPath: require.resolve('./app/lib/cache-handler'),
//         serverComponentsExternalPackages: ['@prisma/client', 'bcrypt', 'fs/promises'],
//         serverActions: {
//             bodySizeLimit: '6mb'
//         }
//     },
//     images: {
//         domains: ['images.pexels.com'],
//         formats: ['image/avif', 'image/webp']
//     }
// };

// // Use dynamic `import.meta.resolve` to handle module paths for ES modules
// // const CacheHandler = import.meta.resolve('./cache-handler.mjs');


// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: true,
//   })

// module.exports = withBundleAnalyzer(nextConfig)