using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Windows.Media;
using System.Windows.Media.Imaging;

using Microsoft.Kinect;

namespace kinectModule
{
    /**
     * Handles color frame serialization
     */
    public static class ColorSerializer
    {
        // Color bitmap source
        static WriteableBitmap _colorBitmap = null;

        // The RGB pixel values
        static byte[] _colorPixels = null;

        // Color frame width, height, stride
        static int _colorWidth;
        static int _colorHeight;
        static int _colorStride;

        /**
         * Serializes a color frame
         * <param name = "frame"> The specified color frame </param>
         * <return> A binary representation of the frame </return>
         */
        public static byte[] serialize(this ColorFrame frame)
        {
            Console.WriteLine("In Color Serializing");
            if (_colorBitmap == null)
            {
                _colorWidth = frame.FrameDescription.Width;
                _colorHeight = frame.FrameDescription.Height;
                _colorStride = _colorWidth * Constants.PIXEL_FORMAT.BitsPerPixel / 8;
                _colorPixels = new byte[frame.FrameDescription.Width * frame.FrameDescription.Height * 4];   //Color image has 4 bytes per pixel
                _colorBitmap = new WriteableBitmap(_colorWidth, _colorHeight, Constants.DPI, Constants.DPI, Constants.PIXEL_FORMAT, null);
            }

            if (frame.RawColorImageFormat == ColorImageFormat.Bgra)
            {
                frame.CopyRawFrameDataToArray(_colorPixels);
            }
            else
            {
                frame.CopyConvertedFrameDataToArray(_colorPixels, ColorImageFormat.Bgra);
            }

            _colorBitmap.WritePixels(new System.Windows.Int32Rect(0, 0, _colorWidth, _colorHeight), _colorPixels, _colorStride, 0);

            return FrameSerializer.createBlob(_colorBitmap, Constants.CAPTURE_FILE_COLOR);
        }
    }   //  end of colorSerializer
}
