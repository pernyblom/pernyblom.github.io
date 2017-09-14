package com.springworldgames.swing.valuecomponents;

import java.awt.Color;

import javax.swing.JLabel;
import javax.swing.JSlider;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;



public class IntegerSliderWithLabel extends ValueComponent {


	int currentValue = 0;

	JLabel label;
	JSlider slider;

	Color origBackground;

	int minValue;
	int maxValue;
	

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		slider.setEnabled(enabled);
	}

	
	public IntegerSliderWithLabel(String propertyName, String labelText,
			int startValue, int minValue, int maxValue) {
		super(propertyName);
		this.minValue = minValue;
		this.maxValue = maxValue;
		
		currentValue = startValue;
		if (labelText != null) {
			label = new JLabel(labelText);
			add(label);
		}
	
		slider = new JSlider(minValue, maxValue, startValue);

		slider.addChangeListener(new ChangeListener() {
			@Override
			public void stateChanged(ChangeEvent e) {
				int oldValue = 0;
				currentValue = slider.getValue();
				informAllListeners(oldValue, currentValue);
			}
		});
		add(slider);
	}

	@Override
	public Object getCurrentValue() {
		return currentValue;
	}


}
