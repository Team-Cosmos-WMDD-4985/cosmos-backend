import multer from "multer";
import fs from "fs";
export default {

    multerConfig : () => {

        const currentDirectory = process.cwd();
        const tempFileName = Math.floor(Math.random()*10) + 1;
        return (
            multer.diskStorage({
                destination: (req, file, cb) => {
                  const path = `${currentDirectory}/src/uploads/pdf/`
                  fs.mkdirSync(path, { recursive: true })
                  return cb(null, path)
                },
                filename: (req, file, cb) => {
                    req.filePath = `${currentDirectory}/src/uploads/pdf/${tempFileName}.pdf`
                    return cb(null, `${tempFileName}.pdf`)
                }
              })
        )
        
    },

    deleteFile : async (path) => {
        fs.unlink(path, (err) => {
            if (err) {
              console.error('An error occurred:', err);
              return;
            }
            console.log('File was deleted successfully');
          });
    }
}