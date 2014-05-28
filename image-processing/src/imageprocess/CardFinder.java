package imageprocess;

import javacrap.WebcamFrame;

import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;

public class CardFinder {

	
	
	public CardFinder() {
		
	}
	
	public void run(){
		System.loadLibrary( Core.NATIVE_LIBRARY_NAME );
		
//		Mat testImg = Highgui.imread("test-set.jpg");
//		Imgproc.cvtColor(testImg, testImg, Imgproc.COLOR_BGR2HSV);
//		Highgui.imwrite("poo.jpg", testImg);
		
//		this.runMikesAwesomeWebcam();
		
		
//		WebcamFrame webcam = new WebcamFrame();
//		webcam.go();

//		int[] hi = new int[]{255, 255, 255};
//		System.out.println(Arrays.toString(hi));
//		Mat colors = Highgui.imread("colors.png");
//		colors.put(0, 0, hi);
//		System.out.println(colors.dump());
		
		//////////////		
	    
		Mat pill = Highgui.imread("img/pill-card.jpg");
		Mat allGreen = Highgui.imread("img/all-green.jpg");
		
		
//		MatchTemplate mt = new MatchTemplate();
//		Mat result = mt.searchForMatch(allGreen, pill, Imgproc.TM_SQDIFF);

		
		PreProcess pp = new PreProcess(allGreen);
	
//		Surf surf = new Surf();
//		Mat result = surf.surfIt(allGreen, pill);
		
//		Flann flann = new Flann();
//		Mat result = flann.flannIt(allGreen, pill);
//		
		
		
//		Highgui.imwrite("match-template.jpg", result);
		
		
		/////////////

	}
	
	
	
	
	public void runMikesAwesomeWebcam() {
		
		
	}
	
}
	
	
