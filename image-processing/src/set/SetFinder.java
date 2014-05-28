package set;

import imageprocess.CardFinder;

import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedList;

import javax.swing.JFrame;

import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.highgui.Highgui;
import org.opencv.highgui.VideoCapture;
import org.opencv.imgproc.Imgproc;


public class SetFinder {

	ArrayList<Card> cards;
	
	BufferedImage image; 

	public SetFinder (ArrayList<Card> cards) {
		this.cards = cards;
	}
	
	public Collection<ThreeCards> findSets() {
		
		Collection<ThreeCards> foundSets = new LinkedList<ThreeCards>();
		
		for(ThreeCards tc : this.getCombos()) {
			
			if (tc.isSet()){
				foundSets.add(tc);
			}
			
		}
		return foundSets;		
	}
	
	

	
	public void findSetsInImage() {
		
		CardFinder cf = new CardFinder();
		
		cf.run();

	}
	
	// n choose 3.  (get all combinations of 3 cards in this.cards without repeats)
	protected ArrayList<ThreeCards> getCombos() {
		
		int k = 3; // we're choosing 3 cards for a set
		
		ArrayList<ThreeCards> combos = new ArrayList<ThreeCards>();
		
		// Set up array to hold k pointers
		int[] pointers = new int[k];
		for (int i = 0; i < k; i++) {
			pointers[i] = i;
		}
		
		
		// go until the left most pointer is as far right as it can get
		while (pointers[0] < this.cards.size() - k) {
			
			// check to see if all pointers are in range (pointing at an 
			// index in the n array).
			// start from the right so we can alter the pointers to the left 
			// if they are moved out of bounds
			for(int i = k-1; i >= 0; i--){
				
				// if this pointer is out of range...
				if (pointers[i] >= (this.cards.size() - (k-i)) + 1 ){
					// move the pointer to the left up by 1
					pointers[i-1]++;

					// reset the pointers to the right of this pointer
					for (int j = i; j < k; j++){
						pointers[j] = pointers[j-1] + 1;
					}
				}
				
			}
			
			ThreeCards threeCards = new ThreeCards(this.cards.get(pointers[0]), 
                    this.cards.get(pointers[1]), 
                    this.cards.get(pointers[2]));
			combos.add(threeCards);
			
			
			// increase the right most pointer by one
			pointers[k-1]++;
		}
			

		

		return combos;
	}	
	
	

	
	
}
