package com.springworldgames.jcgmusic;

public class Time {
	public int mBar;
	public double mPos;

	@Override
	public String toString() {
		return "(" + mBar + ", " + mPos + ")";
	}

	public Time() {
	}

	public Time(int bar, double pos) {
		this.mBar = bar;
		this.mPos = pos;
	}

	public double getPosition(int metrum) {
		return mBar + mPos / metrum;
	}
	
	public Time copy() {
		return new Time(mBar, mPos);
	}

	public void translate(int bars) {
		mBar += bars;
	}

	public void translate(Time t) {
		mBar += t.mBar;
		mPos += t.mPos;
	}

	public Time translateCopy(int bars) {
		Time copy = copy();
		copy.translate(bars);
		return copy;
	}

	public Time translateCopy(Time t) {
		Time copy = copy();
		copy.translate(t);
		return copy;
	}

//	@Override
//	public int compareTo(Time t) {
//		boolean less = (m_Bar < t.m_Bar || (m_Bar == t.m_Bar && m_Pos <= t.m_Pos));
//		if (less) {
//			return -1;
//		} else if (m_Bar == t.m_Bar && m_Pos == t.m_Pos) {
//			return 0;
//		} else {
//			return 1;
//		}
//	}

}
