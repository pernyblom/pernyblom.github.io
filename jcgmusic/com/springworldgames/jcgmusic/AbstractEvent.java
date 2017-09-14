package com.springworldgames.jcgmusic;


public class AbstractEvent {

	public AbstractEvent(Time begin, Time end) {
		this.begin = begin;
		this.end = end;
	}

	private final Time begin;
	private final Time end;

	public Interval2D toInterval2D(int metrum) {
		return new Interval2D(begin.getPosition(metrum), end
				.getPosition(metrum));
	}

	
	public boolean contains(Time t, int metrum) {
		return contains(begin, end, t, metrum);
	}

	public static boolean contains(Time begin, Time end, Time t, int metrum) {
		double beginPos = begin.getPosition(4);
		double endPos = end.getPosition(4);
		double tPos = t.getPosition(4);

		return tPos >= beginPos || tPos <= endPos;
		// boolean greaterEqualThanBegin = (t.compareTo(begin) == 1)
		// || (t.compareTo(begin) == 0);
		// boolean lessThanEnd = t.compareTo(end) == -1;
		// return greaterEqualThanBegin && lessThanEnd;
	}

	public boolean intersects(Time otherBegin, Time otherEnd, int metrum) {
		double beginPos = begin.getPosition(metrum);
		double endPos = end.getPosition(metrum);
		double otherBeginPos = otherBegin.getPosition(metrum);
		double otherEndPos = otherEnd.getPosition(metrum);

		Interval2D interval = new Interval2D(beginPos, endPos);
		Interval2D otherInterval = new Interval2D(otherBeginPos, otherEndPos);

		return interval.intersects(otherInterval);
		// return !((otherEnd.compareTo(begin) == -1) || (otherBegin
		// .compareTo(end) == 1));
	}

	public Interval2D intersect(Time otherBegin, Time otherEnd, int metrum) {
		double beginPos = begin.getPosition(metrum);
		double endPos = end.getPosition(metrum);
		double otherBeginPos = begin.getPosition(metrum);
		double otherEndPos = end.getPosition(metrum);

		Interval2D interval = new Interval2D(beginPos, endPos);
		Interval2D otherInterval = new Interval2D(otherBeginPos, otherEndPos);
		return interval.intersectCopy(otherInterval);
	}
	
	public boolean intersects(ChromaticEvent e, int metrum) {
		return intersects(e.getStart(), e.getEnd(), metrum);
	}

	public AbstractEvent translate(int bars) {
		begin.translate(bars);
		end.translate(bars);
		return this;
	}

	public Time getStart() {
		return begin.copy();
	}

	public Time getEnd() {
		return end.copy();
	}

}
