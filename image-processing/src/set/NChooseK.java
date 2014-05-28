package set;

import java.util.ArrayList;
import java.util.Arrays;

public class NChooseK {
	
	
	public static void main(String[] args) {
		
		String[] alphabet = new String[] {"a", "b", "c", "d", "e"};
		
		ArrayList<String> combos = getCombos(alphabet, 3);
		
		for (String c : combos) {
			System.out.println(c);
		}
	}

	
	public static ArrayList<String> getCombos(String[] n, int k) {
		
		ArrayList<String> combos = new ArrayList<String>();
		
		// Set up array to hold k pointers
		int[] pointers = new int[k];
		for (int i = 0; i < k; i++) {
			pointers[i] = i;
		}
		
		
		// go until the left most pointer is as far right as it can get
		while (pointers[0] < n.length - k) {
			
			// check to see if all pointers are in range (pointing at an 
			// index in the n array).
			// start from the right so we can check the pointers to the left 
			// if they are moved out of bounds
			for(int i = k-1; i >= 0; i--){
				
				// if this pointer is out of range...
				if (pointers[i] >= (n.length - (k-i)) + 1 ){
					
					// move the pointer to the left up by 1
					pointers[i-1]++;

					// reset the pointers to the right of that pointer
					for (int j = i; j < k; j++){
						pointers[j] = pointers[j-1] + 1;
					}
				}
				
			}
			
			String combo = Arrays.toString(pointers) + " ";
			for (int i = 0; i < k; i++){
				combo += n[pointers[i]];
			}		
			combos.add(combo);
			
			// increase the right most pointer by one
			pointers[k-1]++;
		}
		
		
		return combos;
	}	
}
