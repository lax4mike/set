package imageprocess;

import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Toolkit;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javacrap.MatPanel;

import javax.swing.BoxLayout;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JSlider;
import javax.swing.JSpinner;
import javax.swing.SpinnerNumberModel;
import javax.swing.SwingWorker;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint;
import org.opencv.core.MatOfPoint2f;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.RotatedRect;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;


// http://arnab.org/blog/so-i-suck-24-automating-card-games-using-opencv-and-python
public class PreProcess {

	Map<String, Integer> paramMap = new TreeMap<String, Integer>();
	
	JPanel controlPanel;
	Mat source;
	JFrame frame;
	MatPanel framePanel;
	JLabel statusIndicator;

	public PreProcess (Mat source) {
		
		this.source = source;		
		paramMap.put("threshold", 120);
		paramMap.put("perimeterThreshold", 1000);
		 
		createControlFrame();
		 
		createOutputFrame();
		 
	}
	
	public Mat processMat() {
		
		Mat source = this.source;
		Mat source1 = new Mat(source.rows(), source.cols(), CvType.CV_8U);
		Mat source2 = new Mat(source.rows(), source.cols(), CvType.CV_8UC4);
		Mat output = new Mat(source.rows(), source.cols(), CvType.CV_8UC4);
		Mat hierarchy = new Mat(source.rows(), source.cols(), CvType.CV_8U);
		List<MatOfPoint> contours = new ArrayList<MatOfPoint>();
		
		Highgui.imwrite("all-green-1source.jpg", source);
		
		// convert the image to gray scale 
		Imgproc.cvtColor(source, source1, Imgproc.COLOR_BGR2GRAY);
		
		// blur it a little bit
		Imgproc.GaussianBlur(source1, source2, new Size(9, 9), 3, 3);	
		Highgui.imwrite("all-green-2gaussian.jpg", source2);
		
		// turn the image into binary image (black and white)
		Imgproc.threshold(source2, source1, paramMap.get("threshold"), 255, Imgproc.THRESH_BINARY);	
		Highgui.imwrite("all-green-3threshold.jpg", source1);
		
		// apply findCountours to find the lines, then apply another threshold of "not black" to white so
		// the lines become apparent
		Imgproc.findContours(source1, contours, hierarchy, Imgproc.RETR_CCOMP, Imgproc.CHAIN_APPROX_SIMPLE);
		Imgproc.threshold(source1, source2, 1, 255, Imgproc.THRESH_BINARY);
		Highgui.imwrite("all-green-4contours.jpg", source2);
		
		// for each of the contours found
		for(int i = 0; i < contours.size(); i++) {

			MatOfPoint contour = contours.get(i);
			MatOfPoint2f contour2f = new MatOfPoint2f(contour.toArray());
				
//			System.out.println(contour.dump());

			
			// reduce the number of points in the contour
			MatOfPoint2f approx = new MatOfPoint2f();
			double perimeter = Imgproc.arcLength(contour2f, true);
			Imgproc.approxPolyDP(contour2f, approx, 0.02 * perimeter, true);
			

			// If this is a "big" contour
			if (perimeter > paramMap.get("perimeterThreshold")) {
				
				// draw white contours
				Core.drawContours(output, contours, i, new Scalar(255, 255, 255, 255), 20);
				
				// find the bounding rectangle, which can be rotated
				RotatedRect boundingRectangle = Imgproc.minAreaRect(approx);
				Point[] boundingPoints = new Point[4];			
				boundingRectangle.points(boundingPoints);
				
				// draw blue bounding box
				List<MatOfPoint> boundingMatOfPointsList = new ArrayList<MatOfPoint>();
				MatOfPoint boundingMatOfPoints = new MatOfPoint(boundingPoints);
				boundingMatOfPointsList.add(boundingMatOfPoints);
				Core.drawContours(output, boundingMatOfPointsList, -1, new Scalar(255, 0, 0, 255), 5);
				
				// get matrix of each bounding box
				Mat thisCardBoundingBox = source.submat(boundingRectangle.boundingRect());


				// put perspective transform in thisCard
				Mat thisCard = new Mat(4, 1, CvType.CV_32FC2);
				Size cardSize = new Size(200, 300);
				thisCard.put(0,0, 0,0, 0,cardSize.width, cardSize.height,cardSize.width, cardSize.height,0);
				
				Mat boundingMat2f = new Mat(new MatOfPoint2f(boundingPoints), new Rect(0, 0, 1, 4));
				Mat perspectiveTransform = Imgproc.getPerspectiveTransform(boundingMat2f, thisCard);

			
				// warp perspective and put in thisCardWarp not working
				Mat thisCardWarp = new Mat(boundingMat2f.size(), CvType.CV_32FC2);
				Imgproc.warpPerspective(source, thisCardWarp, perspectiveTransform, cardSize); // not working
				
	
				
				
				Highgui.imwrite("z-card" + i + "-boundingBox.jpg", thisCardBoundingBox);
				
				Highgui.imwrite("z-card" + i + "-warped.jpg", thisCardWarp);
								
				
			}

		}
		

		Highgui.imwrite("all-green-5contours-drawn.jpg", output);
		
		statusIndicator.setText("Ready.");
		statusIndicator.repaint();
		
		return output;
	}
	
	
	private void updateOutputFrame() {
		
		statusIndicator.setText("updating...");
		
		// need to do processMat in the background so we can update the GUI (updating...)
		// not sure why, but <Void, Void> is giving me trouble with doInBackground return type. fuck it.
		SwingWorker<String, Void> worker = new SwingWorker<String, Void>() {
			
			@Override
		    public String doInBackground() {
				Mat output =  processMat();
				framePanel.setMat(output);
				return "done";
		    }

		    @Override
		    public void done() {
			    statusIndicator.setText("Ready.");
		    }
		};				
		
		worker.execute();

	}
	
	
	private void createOutputFrame() {
				
		frame = new JFrame("Mike's kick ass image proc");
	    frame.setLocation(0, 10);
	    frame.setVisible(true);
	    
	    Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
	    frame.setSize((int) screenSize.getWidth(), (int) screenSize.getHeight());
		
	    framePanel = new MatPanel();
	    frame.setContentPane(framePanel);

		framePanel.setSize((int) screenSize.getWidth(), (int) screenSize.getHeight());
	    
	    updateOutputFrame();

	}
	
	private void createControlFrame() {
		
		this.controlPanel = new JPanel();
	    this.controlPanel.setLayout(new BoxLayout(controlPanel, BoxLayout.PAGE_AXIS));

		JFrame f = new JFrame("slide 'em");
	    f.setLocation(0, 10); 
	    f.setSize(400, 400);

	    for (String label : paramMap.keySet()) {
	    	this.addSpinner(label);
	    }


	    statusIndicator = new JLabel();
	    statusIndicator.setText("Ready.");
	    
	    controlPanel.add(statusIndicator);
	    
	    f.setContentPane(controlPanel);
	    f.setVisible(true);
	   
	}
	
	private void addSpinner(String label) {
		
		JPanel panel = new JPanel(new FlowLayout(FlowLayout.TRAILING));
		
		final JLabel thisLabel = new JLabel(label); 
		thisLabel.setText(label);
		
		
		Integer value = this.paramMap.get(label);
		Integer min = new Integer(0);
		Integer max = new Integer(99999);
		Integer step = new Integer(1);		
		SpinnerNumberModel model = new SpinnerNumberModel(value, min, max, step);
		
		final JSpinner input = new JSpinner(model);
		input.setName(label);
		
		input.addChangeListener(new ChangeListener() {
			
			@Override
			public void stateChanged(ChangeEvent e) {
				
				JSpinner source = (JSpinner) e.getSource();
				paramMap.put(source.getName(), Integer.parseInt(source.getValue().toString()));
				updateOutputFrame();
		        
			}
		});
		
		panel.add(thisLabel);
		panel.add(input);
		
		controlPanel.add(panel);
	}
	
	private void addSlider(String label) {
		
		JLabel thisLabel = new JLabel(label); 
		
	    JSlider thisSlider = new JSlider(JSlider.HORIZONTAL, 0, 255, 1);
	    thisSlider.setValue(this.paramMap.get(label));
	    thisSlider.setName(label);
	    
	    final JLabel numLabel = new JLabel(Integer.toString(this.paramMap.get(label)));

		
		thisSlider.addChangeListener(new ChangeListener() {

			@Override
			public void stateChanged(ChangeEvent e) {
				JSlider source = (JSlider) e.getSource();
		        if (!source.getValueIsAdjusting()) {
					numLabel.setText(Integer.toString(source.getValue()));
					paramMap.put(source.getName(), source.getValue());
					updateOutputFrame();
		        }  
			}
		});
	    
	    controlPanel.add(thisLabel);
	    controlPanel.add(numLabel);
	    controlPanel.add(thisSlider);
	}
	
	
}














