package javacrap;

import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

import javax.imageio.ImageIO;
import javax.swing.JPanel;

import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.highgui.Highgui;

public class MatPanel extends JPanel {

	private static final long serialVersionUID = 1L;

	Mat mat;
	Image image;

	public void setMat(Mat mat) {
		this.mat = mat;
		this.matToBufferedImage(mat);
		this.repaint();
	}
	
	@Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawImage(this.image, 0, 0, null); 
    }
	
	public boolean matToBufferedImage(Mat source){  

		MatOfByte matOfByte = new MatOfByte();

	    Highgui.imencode(".jpg", source, matOfByte); 

	    byte[] byteArray = matOfByte.toArray();
	    BufferedImage bufImage = null;


	    try {
	        InputStream in = new ByteArrayInputStream(byteArray);
	        bufImage = ImageIO.read(in);
	        
	        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
	        Image scaledImage = bufImage.getScaledInstance((int) screenSize.getWidth(),(int) screenSize.getHeight(), Image.SCALE_SMOOTH);
	        this.image = scaledImage;
	    } catch (Exception e) {
	        e.printStackTrace();
	        return false;
	    }
	    
	    return true;
	} 
	
	
}
