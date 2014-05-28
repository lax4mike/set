package set;

import java.util.ArrayList;
import java.util.Collection;

import set.Card.Color;
import set.Card.Count;
import set.Card.Shade;
import set.Card.Shape;

public class Test {
	
	
	public static void main(String[] args) {
		
		ArrayList<Card> cards = new ArrayList<Card>();
		
		// test1.png
//		cards.add(new Card(Count.THREE, Color.GREEN, Shade.SOLID, Shape.NUT));
//		cards.add(new Card(Count.ONE, Color.RED, Shade.SOLID, Shape.PILL));
//		cards.add(new Card(Count.THREE, Color.RED, Shade.HOLLOW, Shape.NUT));
//		cards.add(new Card(Count.TWO, Color.GREEN, Shade.HOLLOW, Shape.PILL));
//		cards.add(new Card(Count.TWO, Color.GREEN, Shade.SHADED, Shape.PILL));
//		cards.add(new Card(Count.ONE, Color.RED, Shade.SHADED, Shape.NUT));
//		cards.add(new Card(Count.ONE, Color.GREEN, Shade.SHADED, Shape.PILL));
//		cards.add(new Card(Count.ONE, Color.RED, Shade.HOLLOW, Shape.PILL));
//		cards.add(new Card(Count.TWO, Color.PURPLE, Shade.SHADED, Shape.NUT));
//		cards.add(new Card(Count.TWO, Color.GREEN, Shade.SHADED, Shape.NUT));
//		cards.add(new Card(Count.TWO, Color.RED, Shade.SHADED, Shape.PILL));
//		cards.add(new Card(Count.THREE, Color.PURPLE, Shade.SHADED, Shape.DIAMOND));
		
		// test2.png
		cards.add(new Card(Count.TWO, Color.RED, Shade.SOLID, Shape.DIAMOND));
		cards.add(new Card(Count.ONE, Color.GREEN, Shade.SHADED, Shape.DIAMOND));
		cards.add(new Card(Count.TWO, Color.PURPLE, Shade.SOLID, Shape.DIAMOND));
		cards.add(new Card(Count.TWO, Color.RED, Shade.SHADED, Shape.NUT));
		cards.add(new Card(Count.THREE, Color.GREEN, Shade.HOLLOW, Shape.DIAMOND));
		cards.add(new Card(Count.ONE, Color.PURPLE, Shade.SOLID, Shape.PILL));
		cards.add(new Card(Count.THREE, Color.RED, Shade.HOLLOW, Shape.DIAMOND));
		cards.add(new Card(Count.ONE, Color.GREEN, Shade.HOLLOW, Shape.NUT));
		cards.add(new Card(Count.ONE, Color.RED, Shade.SHADED, Shape.DIAMOND));
		cards.add(new Card(Count.THREE, Color.RED, Shade.SHADED, Shape.DIAMOND));
		cards.add(new Card(Count.TWO, Color.RED, Shade.SHADED, Shape.DIAMOND));
		cards.add(new Card(Count.TWO, Color.PURPLE, Shade.HOLLOW, Shape.NUT));
		
		SetFinder sf = new SetFinder(cards);
		
//		Collection<ThreeCards> sets = sf.findSets();
//		
//		for (ThreeCards set : sets){
//			System.out.println(set);
//		}


		sf.findSetsInImage();
		
		
	}
	
	
	
}


