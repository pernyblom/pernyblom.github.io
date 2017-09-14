package com.springworldgames.swing.valuecomponents;

import java.awt.Color;

import javax.swing.JLabel;
import javax.swing.JSlider;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import com.springworldgames.jcgmusic.MathUtils;

public class DoubleSliderWithLabel extends ValueComponent {

	double currentValue = 0.0;

	JLabel label;
	JSlider slider;

	Color origBackground;

	double multiplier = 1.0;
	double offset = 0.0;

	int intMinValue = 0;
	int intMaxValue = 100;
	
	double minValue;
	double maxValue;
	
	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		slider.setEnabled(enabled);
	}
	
	int getIntValue(double value) {
		return MathUtils.clampInt((int) (multiplier * (value + offset)), intMinValue, intMaxValue);
	}
	
	double getDoubleValue(int intValue) {
		double value = (intValue / multiplier) - offset;
		return MathUtils.clamp(value, minValue, maxValue); 
	}
	
	
	public DoubleSliderWithLabel(String propertyName, String labelText,
			double startValue, double minValue, double maxValue) {
		super(propertyName);
		this.minValue = minValue;
		this.maxValue = maxValue;
		
		currentValue = startValue;
		if (labelText != null) {
			label = new JLabel(labelText);
			add(label);
		}
	
		// Find a good multiplier
		double span = maxValue - minValue;
		offset = -minValue;
		multiplier = intMaxValue / span;
		
		int currentIntValue = getIntValue(startValue);
		
		slider = new JSlider(intMinValue, intMaxValue, currentIntValue);

		slider.addChangeListener(new ChangeListener() {
			@Override
			public void stateChanged(ChangeEvent e) {
				int oldValue = 0;
				currentValue = getDoubleValue(slider.getValue());
				informAllListeners(oldValue, currentValue);
			}
		});
		add(slider);
	}

	@Override
	public Object getCurrentValue() {
		return currentValue;
	}

	void setSliderValue(double v) {
		slider.setValue(getIntValue(v));
	}
	

	public void setCurrentValue(double v) {
		setSliderValue(v);
		currentValue = v;
	}

}
