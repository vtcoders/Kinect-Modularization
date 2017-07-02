using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

using System.Windows.Media;
using System.Windows.Media.Imaging;

using Microsoft.Kinect;

namespace kinectModule
{
    /**
     * This class converts a Kinect frame into an HTML5 blob
     */
    public static class FrameSerializer
    {
        /**
         * Converts a WriteableBitmap into a byte array
         * <param name = "bitmap"> The specified bitmap </param>
         * <param name = "file"> The specified temporary file </param>
         * <return> A binary represenation of the bitmap </return>
         */
        public static byte[] createBlob(WriteableBitmap bitmap, string file)
        {
            // Save bitmap
            BitmapEncoder encoder = new JpegBitmapEncoder();
            encoder.Frames.Add(BitmapFrame.Create(bitmap as BitmapSource));
            using (var stream = new FileStream(file, FileMode.Create))
            {
                encoder.Save(stream);
            }

            // Convert saved bitmap to blob
            using (var stream = new FileStream(file, FileMode.Open, FileAccess.Read))
            {
                using (BinaryReader reader = new BinaryReader(stream))
                {
                    return reader.ReadBytes((int)stream.Length);
                }
            }
        }
    }
}
