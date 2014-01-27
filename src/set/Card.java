package set;

import java.util.HashMap;
import java.util.Map;

public class Card {

	public enum Count { ONE, TWO, THREE }
	public enum Color { RED, GREEN, PURPLE }
	public enum Shade { HOLLOW, SHADED, SOLID }
	public enum Shape { PILL, NUT, DIAMOND }
	
	// using an attributes map so it's easy to iterate over (ThreeCards.java)
	Map<String, Enum<?>> attributes;
	
	static String[] attributeKeys = {"count", "color", "shade", "shape"};


	public Card (Enum<Count> count, Enum<Color> color, Enum<Shade> shade, Enum<Shape> shape) {
		
		this.attributes = new HashMap<String, Enum<?>>();
		
		this.attributes.put("count", count);
		this.attributes.put("color", color);
		this.attributes.put("shade", shade);
		this.attributes.put("shape", shape);

	}
	
	
	public Enum<?> getCount() {
		return this.attributes.get("count");
	}

	public Enum<?> getColor() {
		return this.attributes.get("color");
	}

	public Enum<?> getShade() {
		return this.attributes.get("shade");
	}

	public Enum<?> getShape() {
		return this.attributes.get("shape");
	}



	public String toString() {
		
		return this.getCount() + " " + this.getColor() + " " + this.getShade() + " " + this.getShape();
	}
	
	
}
