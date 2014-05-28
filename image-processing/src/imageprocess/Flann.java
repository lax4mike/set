package imageprocess;

import java.util.ArrayList;
import java.util.List;

import org.opencv.core.CvType;
import org.opencv.core.DMatch;
import org.opencv.core.Mat;
import org.opencv.core.MatOfDMatch;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.features2d.DescriptorExtractor;
import org.opencv.features2d.DescriptorMatcher;
import org.opencv.features2d.FeatureDetector;
import org.opencv.features2d.Features2d;
import org.opencv.imgproc.Imgproc;

// http://docs.opencv.org/doc/tutorials/features2d/feature_flann_matcher/feature_flann_matcher.html#feature-flann-matcher
public class Flann {

	private FeatureDetector fd;
	private DescriptorExtractor de;
	private DescriptorMatcher matcher; 
	
	private Mat sourceGray;
	private MatOfKeyPoint sourceKeyPoints;
	private Mat sourceDescriptors;
	
	private Mat templateGray;
	private MatOfKeyPoint templateKeyPoints;
	private Mat templateDescriptors;
	
	private MatOfDMatch matches; 
	
	Mat result;
	
	int minHessian = 400;
	
	Mat descriptors;

	
	
	public Flann () {
		this.sourceKeyPoints = new MatOfKeyPoint();
		this.templateKeyPoints = new MatOfKeyPoint();
		this.fd = FeatureDetector.create(FeatureDetector.HARRIS);
		this.de = DescriptorExtractor.create(DescriptorExtractor.SURF);
		this.matcher = DescriptorMatcher.create(DescriptorMatcher.FLANNBASED);
		this.matches = new MatOfDMatch();
		
	}
	
	public Mat flannIt(Mat source, Mat template) {

		result = new Mat(source.rows(), source.cols(), CvType.CV_32FC1);
		this.sourceGray = new Mat(source.rows(), source.cols(), CvType.CV_8UC1);
		this.sourceDescriptors = new Mat();
		this.templateGray = new Mat(template.rows(), template.cols(), CvType.CV_8UC1);
		this.templateDescriptors = new Mat();
		
        
		// convert input to grey
		Imgproc.cvtColor(source, this.sourceGray, Imgproc.COLOR_BGR2GRAY);
		Imgproc.cvtColor(template, this.templateGray, Imgproc.COLOR_BGR2GRAY);
		
		//-- Step 1: Detect the keypoints using SURF Detector
		fd.detect(this.sourceGray, this.sourceKeyPoints);
		fd.detect(this.templateGray, this.templateKeyPoints);
		
		
		//-- Step 2: Calculate descriptors (feature vectors)
		this.de.compute(this.sourceGray, this.sourceKeyPoints, this.sourceDescriptors);
		this.de.compute(this.templateGray, this.templateKeyPoints, this.templateDescriptors);
		
		
		//-- Step 3: Matching descriptor vectors using FLANN matcher
		this.matcher.match(this.sourceDescriptors, this.templateDescriptors, matches);
		
		
		//-- Quick calculation of max and min distances between keypoints
		double minDist = 100;
		double maxDist = 0;
		
		for (int i = 0; i < matches.toArray().length; i++) {
			double dist = matches.toArray()[i].distance;
			if( dist < minDist ) minDist = dist;
		    if( dist > maxDist ) maxDist = dist;
		}
		
		//-- Draw only "good" matches (i.e. whose distance is less than 2*min_dist,
		//-- or a small arbitary value ( 0.02 ) in the event that min_dist is very
		//-- small)
		//-- PS.- radiusMatch can also be used here.
		
		List<DMatch> goodMatches = new ArrayList<DMatch>();
		for (int i = 0; i < matches.toArray().length; i++) {
			DMatch match = matches.toArray()[i];
			if( match.distance <= Math.max(2*minDist, 0.02) ) {
				goodMatches.add(match); 
			}
		}
		
		Features2d.drawMatches(source, this.sourceKeyPoints, template, this.templateKeyPoints, matches, this.result);
		
		
		
//		System.out.println("max dist: " + maxDist);
//		System.out.println("min dist: " + minDist);
		
//		Features2d.drawKeypoints(this.sourceGray, this.sourceKeyPoints, this.result);
		
		
		return result;
		
	}
}
