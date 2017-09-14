package com.springworldgames.jcgmusic;

public class Interval2D {

	public double lower = 0.0;
	public double upper = 1.0;

	public Interval2D() {
	}

	public Interval2D(double lower, double upper) {
		this.lower = lower;
		this.upper = upper;
		if (lower > upper) {
			lower = upper;
		}
	}

	public boolean within(Interval2D interval) {
		return interval.lower >= lower && interval.upper <= upper;
	}
	
	public Interval2D copy() {
		return new Interval2D(lower, upper);
	}
	
	public double distanceBetween(Interval2D interval) {
		if (intersects(interval)) {
			return 0.0;
		} else if (interval.lower >= upper) {
			return interval.lower - upper;
		} else if (interval.upper <= lower) {
			return lower - interval.upper;
		} else {
			System.out
					.println(this
							+ " found a distanceBetween() case that is impossible :) "
							+ this + " " + interval);
			return 0.0;
		}
	}

	public Interval2D intersect(Interval2D interval) {
		if (intersects(interval)) {
			lower = Math.max(lower, interval.lower);
			upper = Math.min(upper, interval.upper);
		} else {
			upper = lower;
		}
		return this;
	}
	
	public Interval2D intersectCopy(Interval2D interval) {
		return copy().intersect(interval);
	}
	
	public boolean intersects(Interval2D interval) {
		if (interval.upper < lower || upper < interval.lower) {
			return false;
		} else {
			return true;
		}
	}

	// This is not a union operation.
	// Union requires more information than a single interval
	public Interval2D merge(Interval2D interval) {
		lower = Math.min(lower, interval.lower);
		upper = Math.max(upper, interval.upper);
		return this;
	}

	@Override
	public String toString() {
		return "[" + lower + ".." + upper + "]";
	}

	public boolean contains(double p) {
		return p >= lower && p <= upper;
	}

	public double getLength() {
		return Math.abs(upper - lower);
	}

	public Interval2D getIntervalBefore(double point) {
		return new Interval2D(lower, Math.min(upper, point));
	}

	public Interval2D getIntervalAfter(double point) {
		return new Interval2D(Math.min(upper, point), upper);
	}

}
