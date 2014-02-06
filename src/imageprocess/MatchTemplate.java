package imageprocess;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.Core.MinMaxLocResult;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

public class MatchTemplate {

	
	
	// using matchTemplate, probably doesn't work well because of scale
	protected Mat searchForMatch(Mat source, Mat template, int match_method) {
		
		// / Create the result matrix
        int result_cols = source.cols() - template.cols() + 1;
        int result_rows = source.rows() - template.rows() + 1;
        
        Mat result = new Mat(result_rows, result_cols, CvType.CV_8UC3);
        
        // / Do the Matching and Normalize
        Imgproc.matchTemplate(source, template, result, match_method);
        Core.normalize(result, result, 0, 255, Core.NORM_MINMAX, -1, new Mat());
        
        // / Localizing the best match with minMaxLoc
        MinMaxLocResult mmr = Core.minMaxLoc(result);

        Point matchLoc;
        if (match_method == Imgproc.TM_SQDIFF || match_method == Imgproc.TM_SQDIFF_NORMED) {
            matchLoc = mmr.minLoc;
        } else {
            matchLoc = mmr.maxLoc;
        }
        System.out.println(matchLoc);
        
        // / Show me what you got
        Core.rectangle(source, matchLoc, new Point(matchLoc.x + template.cols(),
                matchLoc.y + template.rows()), new Scalar(0, 255, 0));
        
        return result;
        
	}
	
	
	// match_method Imgproc.TM_CCOEFF
	// http://stackoverflow.com/questions/17001083/opencv-template-matching-example-in-android
	public void templateMatch (String inFile, String templateFile, String outFile, int match_method) {
        
		System.out.println("\nRunning Templat"
				+ "e Matching");

        Mat img = Highgui.imread(inFile);
        Mat templ = Highgui.imread(templateFile);
        
        // / Create the result matrix
        int result_cols = img.cols() - templ.cols() + 1;
        int result_rows = img.rows() - templ.rows() + 1;
 
        Mat result = new Mat(result_rows, result_cols, CvType.CV_32FC1);
        
        // / Do the Matching and Normalize
        Imgproc.matchTemplate(img, templ, result, match_method);
        Core.normalize(result, result, 0, 1, Core.NORM_MINMAX, -1, new Mat());

        // / Localizing the best match with minMaxLoc
        MinMaxLocResult mmr = Core.minMaxLoc(result);

        Point matchLoc;
        if (match_method == Imgproc.TM_SQDIFF || match_method == Imgproc.TM_SQDIFF_NORMED) {
            matchLoc = mmr.minLoc;
        } else {
            matchLoc = mmr.maxLoc;
        }

        // / Show me what you got
        Core.rectangle(img, matchLoc, new Point(matchLoc.x + templ.cols(),
                matchLoc.y + templ.rows()), new Scalar(0, 255, 0));

        // Save the visualized detection.
        System.out.println("Writing "+ outFile);
        Highgui.imwrite(outFile, img);

    }
}

