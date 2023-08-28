// cloudinaryConfig.ts
import cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';

// Set up Cloudinary configuration
cloudinaryV2.config({
    cloud_name: 'dofqdjya8', 
    api_key: '416125953541235', 
    api_secret: 'MeZYxFvPOzS51ACsECtVyewfOFI',
    secure:true
});

export default cloudinary;
