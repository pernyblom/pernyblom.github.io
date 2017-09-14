package com.springworldgames.jcgmusic;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Random;

public class Utils {

	

	public static <T> void expandIfNeccessary(int index, ArrayList<T> list, Class<?> cl) {
		if (index < list.size()) {
			// OK
		} else {
			int toAdd = index - list.size() + 1;
			for (int i = 0; i < toAdd; i++) {
				try {
					list.add((T) cl.newInstance());
				} catch (Exception e) {
					throw new IllegalArgumentException(
							"Class "
									+ cl.getName()
									+ " is not instantiable with 0 arguments or something else was wrong.");
				}
			}
		}
	}

	public static <T> void setSize(int size, ArrayList<T> list, Class<?> cl) {
		expandIfNeccessary(size-1, list, cl);
		if (list.size() > size) {
			int toRemove = list.size() - size;
			for (int i=0; i<toRemove; i++) {
				list.remove(list.size() - 1);
			}
		}
	}
	
	public static int getRandomInt(int lowerBound, int upperBound, Random rnd) {
		int diff = upperBound - lowerBound;
		return MathUtils.clampIntToInt((int) (rnd.nextDouble() * (diff + 1))
				+ lowerBound, lowerBound, upperBound);
	}

	
	public static double getRandomBetween(double lower, double upper, Random rnd) {
		return rnd.nextDouble() * (upper - lower) + lower;
	}

	public static <T> T sampleUniformObjectDistribution(Random rnd,
			Collection<T> domain) {
		return (T) sampleUniformObjectDistribution(rnd,
				new ArrayList<T>(domain));
	}

	public static <T> T sampleUniformObjectDistribution(Random rnd,
			ArrayList<T> domain) {
		double rndValue = rnd.nextDouble();
		int index = (int) Math.min(domain.size() - 1, rndValue * domain.size());
		return domain.get(index);
	}

	
	public static <T> T sampleUniformObjectDistribution(Random rnd, T[] domain) {
		double rndValue = rnd.nextDouble();
		int index = (int) Math.min(domain.length - 1, rndValue * domain.length);
		return domain[index];
	}

}
