package com.springworldgames.jcgmusic;

import java.util.ArrayList;

public class Sentence {

	private ArrayList<Phrase> phrases = new ArrayList<Phrase>();
	
	public void setPhrases(int count) {
		Utils.setSize(count, phrases, Phrase.class);
	}
	
	public int getPhrases() {
		return phrases.size();
	}
	
	public Phrase getPhrase(int index) {
		Utils.expandIfNeccessary(index, phrases, Phrase.class);
		return phrases.get(index);
	}
	
	public int getBars() {
		int sum = 0;
		for (Phrase p : phrases) {
			sum += p.getBars();
		}
		return sum;
	}
}
