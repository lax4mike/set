package javacrap;

import java.util.Map;
import java.util.TreeMap;

import javax.swing.BoxLayout;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JSlider;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.Scalar;
import org.opencv.highgui.VideoCapture;
import org.opencv.imgproc.Imgproc;

public class WebcamFrame {

	Map<String, Integer> hsvMap = new TreeMap<String, Integer>();
		
	JPanel sliderPanel;
	
	public WebcamFrame () {
		
	    hsvMap.put("H_MIN", 0);
	    hsvMap.put("H_MAX", 255);
	    hsvMap.put("S_MIN", 0);
	    hsvMap.put("S_MAX", 255);
	    hsvMap.put("V_MIN", 0);
	    hsvMap.put("V_MAX", 255);
	    
	    sliderPanel = new JPanel();
	    sliderPanel.setLayout(new BoxLayout(sliderPanel, BoxLayout.PAGE_AXIS));
		
	}

	public void go() {
		
		
		this.createSliders();
		
		this.createWebcamFrame();
		
		
	}
	
	private Mat processMat(Mat mat) {
		
		Imgproc.cvtColor(mat, mat, Imgproc.COLOR_BGR2HSV);
		
		Scalar lowerb = new Scalar(
			hsvMap.get("H_MIN"),
			hsvMap.get("S_MIN"),
			hsvMap.get("V_MIN")
		);
		Scalar upperb = new Scalar(
				hsvMap.get("H_MAX"),
				hsvMap.get("S_MAX"),
				hsvMap.get("V_MAX")
			);
		Core.inRange(mat, lowerb, upperb, mat);
		
		return mat;
		
	}
	
	
	
	
	private void createWebcamFrame() {
		
		Mat cameraFeed = new Mat();
		VideoCapture capture = new VideoCapture();
		capture.open(0);
		
		JFrame f = new JFrame("Mike's kick ass web cam");
	    f.setLocation(0, 10);
	    f.setVisible(true);
	    
	    MatPanel panel = new MatPanel();
	    f.setContentPane(panel);
	    
	    
	    
		while (true) {

			capture.read(cameraFeed);
			
			cameraFeed = this.processMat(cameraFeed);
			
			panel.setMat(cameraFeed);
			
			f.setSize(cameraFeed.width(), cameraFeed.height());

		}
	}
	
	
	private void createSliders() {

		JFrame f = new JFrame("slide 'em");
	    f.setLocation(0, 10); 
	    f.setSize(400, 400);

	    for (String label : hsvMap.keySet()) {
	    	this.addSlider(label);
	    }

	    f.setContentPane(sliderPanel);
	    f.setVisible(true);
	   
	}
	
	private void addSlider(String label) {
		
		JLabel thisLabel = new JLabel(label); 
		
	    JSlider thisSlider = new JSlider(JSlider.HORIZONTAL, 0, 255, 1);
	    thisSlider.setValue(this.hsvMap.get(label));
	    thisSlider.setName(label);
	    
	    final JLabel numLabel = new JLabel(Integer.toString(this.hsvMap.get(label)));

		
		thisSlider.addChangeListener(new ChangeListener() {

			@Override
			public void stateChanged(ChangeEvent e) {
				JSlider source = (JSlider) e.getSource();
//		        if (!source.getValueIsAdjusting()) {
					numLabel.setText(Integer.toString(source.getValue()));
		            hsvMap.put(source.getName(), source.getValue());
//		        }  
			}
		});
	    
	    sliderPanel.add(thisLabel);
	    sliderPanel.add(numLabel);
	    sliderPanel.add(thisSlider);
	}
	
	
	
}
