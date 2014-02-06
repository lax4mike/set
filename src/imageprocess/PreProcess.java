package imageprocess;

import java.awt.Dimension;
import java.awt.Toolkit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javacrap.MatPanel;

import javax.swing.BoxLayout;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JSlider;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Size;
import org.opencv.highgui.Highgui;
import org.opencv.highgui.VideoCapture;
import org.opencv.imgproc.Imgproc;


// http://arnab.org/blog/so-i-suck-24-automating-card-games-using-opencv-and-python
public class PreProcess {

	Map<String, Integer> paramMap = new TreeMap<String, Integer>();
	
	JPanel sliderPanel;
	Mat source;
	JFrame frame;
	MatPanel framePanel;

	public PreProcess (Mat source) {
		
		this.source = source;		
		paramMap.put("threshold", 120);
		 
		createSliders();
		 
		createOutputFrame();
		 
	}
	
	public Mat processMat() {
		
		Mat source = this.source;
		Mat source1 = new Mat(source.rows(), source.cols(), CvType.CV_8U);
		Mat source2 = new Mat(source.rows(), source.cols(), CvType.CV_8U);
		Mat hierarchy = new Mat(source.rows(), source.cols(), CvType.CV_8U);
		List<MatOfPoint> contours = new ArrayList<MatOfPoint>();
		
		Imgproc.cvtColor(source, source1, Imgproc.COLOR_BGR2GRAY);
		
		Imgproc.GaussianBlur(source1, source2, new Size(9, 9), 3, 3);	
		Highgui.imwrite("all-green-1gaussian.jpg", source2);
		
		Imgproc.threshold(source2, source1, paramMap.get("threshold"), 255, Imgproc.THRESH_BINARY);	
		Highgui.imwrite("all-green-2threshold.jpg", source1);
		
		Imgproc.findContours(source1, contours, hierarchy, Imgproc.RETR_CCOMP, Imgproc.CHAIN_APPROX_SIMPLE);
		Highgui.imwrite("all-green-3contours.jpg", source1);
		
		System.out.println("preProcessIt done.");
		
		return source1;
	}
	
	
	private void updateOutputFrame() {
		Mat output = new Mat();
		output = this.processMat();
		
		framePanel.setMat(output);	
		
		Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
		framePanel.setSize((int) screenSize.getWidth(), (int) screenSize.getHeight());
	}
	
	
	private void createOutputFrame() {
				
		frame = new JFrame("Mike's kick ass image proc");
	    frame.setLocation(0, 10);
	    frame.setVisible(true);
	    
	    Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
	    frame.setSize((int) screenSize.getWidth(), (int) screenSize.getHeight());
		
	    framePanel = new MatPanel();
	    frame.setContentPane(framePanel);
	    
	    updateOutputFrame();

	}
	
	private void createSliders() {
		
		this.sliderPanel = new JPanel();
	    this.sliderPanel.setLayout(new BoxLayout(sliderPanel, BoxLayout.PAGE_AXIS));

		JFrame f = new JFrame("slide 'em");
	    f.setLocation(0, 10); 
	    f.setSize(400, 400);

	    for (String label : paramMap.keySet()) {
	    	this.addSlider(label);
	    }

	    f.setContentPane(sliderPanel);
	    f.setVisible(true);
	   
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
	    
	    sliderPanel.add(thisLabel);
	    sliderPanel.add(numLabel);
	    sliderPanel.add(thisSlider);
	}
	
	
}














