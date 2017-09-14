package com.springworldgames.swing.valuecomponents;

import java.awt.Dimension;

import javax.swing.BoxLayout;
import javax.swing.JLabel;
import javax.swing.JSlider;
import javax.swing.JSpinner;
import javax.swing.SpinnerNumberModel;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import com.springworldgames.jcgmusic.MathUtils;

public class IntegerSliderSpinnerWithLabel extends ValueComponent {

	int currentValue = 0;

	JLabel label;
	JSlider slider;
	JSpinner spinner;

	int minValue;
	int maxValue;

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		slider.setEnabled(enabled);
		spinner.setEnabled(enabled);
	}
	
	public IntegerSliderSpinnerWithLabel(String propertyName, String labelText,
			int startValue, int minValue, int maxValue, int step) {
		super(propertyName);
		this.minValue = minValue;
		this.maxValue = maxValue;

		if (labelText != null) {
			label = new JLabel(labelText);
			label.setAlignmentY(0.5f);
			add(label);
		}
		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
		
		currentValue = MathUtils.clampIntToInt(startValue, minValue, maxValue);

		spinner = new JSpinner(new SpinnerNumberModel(currentValue, minValue,
				maxValue, step));
		spinner.setMaximumSize(new Dimension(50, 30));
		spinner.setAlignmentY(0.5f);
		
		spinner.addChangeListener(new ChangeListener() {
			@Override
			public void stateChanged(ChangeEvent e) {
				int oldValue = currentValue;
				currentValue = (Integer) ((SpinnerNumberModel) spinner
						.getModel()).getValue();
				informAllListeners(oldValue, currentValue);
				int sliderValue = slider.getValue();
				if (sliderValue != currentValue) {
					slider.setValue(currentValue);
				}
			}
		});

		slider = new JSlider(minValue, maxValue, currentValue);

		slider.addChangeListener(new ChangeListener() {
			@Override
			public void stateChanged(ChangeEvent e) {
				int oldValue = currentValue;
				currentValue = slider.getValue();
				informAllListeners(oldValue, currentValue);
				int spinnerValue = (Integer) ((SpinnerNumberModel) spinner
						.getModel()).getNumber();
				if (spinnerValue != currentValue) {
					((SpinnerNumberModel) spinner.getModel())
							.setValue(currentValue);
				}
			}
		});
		slider.setAlignmentY(0.5f);
		add(slider);
		add(spinner);
	}

	@Override
	public Object getCurrentValue() {
		return currentValue;
	}

	public void setCurrentValue(int v) {
		slider.setValue(v);
		currentValue = v;
	}

}
