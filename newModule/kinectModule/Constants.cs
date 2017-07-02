using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace kinectModule
{
    class Constants
    {
        /**
         * Maximum depth distance
         */
        public static readonly float MAX_DEPTH_DISTANCE = 4095;

        /**
         * Minimum depth distance
         */
        public static readonly float MIN_DEPTH_DISTANCE = 850;

        /**
         * DPI (Dots per Inch)
         */
         public static readonly double DPI = 96.0;

        /**
         * Maximum depth distance offset
         */
        public static readonly float MAX_DEPTH_DISTANCE_OFFSET = MAX_DEPTH_DISTANCE - MIN_DEPTH_DISTANCE;

        /**
         * Default name for temporary color files
         */
        public static readonly string CAPTURE_FILE_COLOR = "Capture_Color.jpg";

        /**
         * Default name for temporary depth files
         */
        public static readonly string CAPTURE_FILE_DEPTH = "Capture_Depth.jpg";

        /**
         * The pixel format
         */
        public static readonly PixelFormat PIXEL_FORMAT = PixelFormats.Bgra32;
    }
}
