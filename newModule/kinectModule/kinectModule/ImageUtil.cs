using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace kinectModule
{
    public class ImageUtil
    {
        /**
         * Converts a given image file to byte array
         * <param name = "path"> The image full path </param>
         * <return> The byte array representation of the image </return>
         */
        public static byte[] ToByteArray(string path)
        {
            try
            {
                using (FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read))
                {
                    using (BinaryReader br = new BinaryReader(fs))
                    {
                        return br.ReadBytes((int)fs.Length);
                    }
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }   // end of ToByteArray
    }   // end of ImageUtil
}
