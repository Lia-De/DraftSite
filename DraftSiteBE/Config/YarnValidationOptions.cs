namespace DraftSiteBE.Config
{
    public class YarnValidationOptions
    {
        // Administrator-configurable validation bounds (defaults provided)
        public int PlyMin { get; set; } = 1;
        public int PlyMax { get; set; } = 3;
        public int ThicknessMin { get; set; } = 6;
        public int ThicknessMax { get; set; } = 36;
    }
}