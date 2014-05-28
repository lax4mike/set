package set;

// A container for a potential set of 3 cards
public class ThreeCards {
	
	Card card1;
	Card card2;
	Card card3;
	
	public ThreeCards (Card card1, Card card2, Card card3) {
		this.card1 = card1;
		this.card2 = card2;
		this.card3 = card3;
	}

	// returns true is these 3 cards are a set
	public boolean isSet() {
			
		// for each attribute (color, count, shade, shape)
		for (String att : Card.attributeKeys) {
			
			// if this attribute is the same for all cards, go on to the next
			if (card1.attributes.get(att).equals(card2.attributes.get(att)) 
			 && card2.attributes.get(att).equals(card3.attributes.get(att))) {
				continue;
			}
			
			
			// if the attribute is different for all cards, go on to the next
			if (!card1.attributes.get(att).equals(card2.attributes.get(att))
			 && !card2.attributes.get(att).equals(card3.attributes.get(att))
			 && !card3.attributes.get(att).equals(card1.attributes.get(att))) {
				 continue;
			}
			
			// if this attribute is not the same nor different for each card, 
			// this is not a set
			return false;
			
		}
		
		// if we've gone through all the attributes, without failure, this is a set
		return true;
	
	}
	
	public String toString() {
		
		return this.card1 + " | " + this.card2 + " | " + this.card3;
		
	}
	
}
