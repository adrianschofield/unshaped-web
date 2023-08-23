using System;

namespace unshaped_web.Models
{
    public class Quality
    {
        public double horResolution { get; set; }
        public double verResolution { get; set; }
        public double fps { get; set; }
        public double bitrate { get; set; }
        public double quality { get; set; }
        public double results { get; set; }

        public Quality(double qual) {
            this.quality = qual;
        }
    }
}