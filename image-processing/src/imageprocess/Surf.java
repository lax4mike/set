package imageprocess;

import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.features2d.DescriptorExtractor;
import org.opencv.features2d.FeatureDetector;
import org.opencv.features2d.Features2d;

public class Surf {
	
	private FeatureDetector fd;
	private MatOfKeyPoint keyPoints;
	private DescriptorExtractor de;
	
	Mat descriptors;

	private Mat mGrayMat;
	private Mat mRgba;
	
	public Surf () {
		this.keyPoints = new MatOfKeyPoint();
		this.de = DescriptorExtractor.create(DescriptorExtractor.SURF); 
		this.fd = FeatureDetector.create(FeatureDetector.HARRIS);
	}
	
	
	// http://stackoverflow.com/questions/14940111/opencv-featuredetector
	protected Mat surfIt(Mat source, Mat template) {
		
		// / Create the result matrix
        int result_cols = source.cols();
        int result_rows = source.rows();
        
        Mat result = new Mat(result_rows, result_cols, CvType.CV_32FC1);
        
        mRgba = new Mat(result_rows, result_cols, CvType.CV_8UC4);
        mGrayMat = new Mat(result_rows, result_cols, CvType.CV_8UC1);
        

		source.copyTo(mRgba);
		
		fd.detect(mRgba, keyPoints);

		//de.compute(mRgba, keyPoints, descriptors);
		
		Features2d.drawKeypoints(mRgba, keyPoints, mRgba);
		
		return mRgba;

	}
	

}
