package com.springworldgames.jcgmusic;

public class Phrase {

	private int bars = 2;
	private int uPhraseId;
	private UniquePhrase uniquePhrase;
	
	public void setUniquePhrase(int id) {
		this.uPhraseId = id;
	}

	public UniquePhrase getUniquePhrase() {
		return uniquePhrase;
	}
	
	public int getUniquePhraseID() {
		return uPhraseId;
	}
	
	public void setBars(int bars) {
		this.bars = bars;
	}
	
	public int getBars() {
		return bars;
	}

	public void setUniquePhrase(UniquePhrase uniquePhrase) {
		this.uniquePhrase = uniquePhrase;
	}
}
