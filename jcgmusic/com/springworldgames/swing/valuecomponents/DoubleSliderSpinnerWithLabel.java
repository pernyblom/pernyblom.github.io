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

public class DoubleSliderSpinnerWithLabel extends ValueComponent {

	double currentValue = 0;

	JLabel label;
	JSlider slider;
	JSpinner spinner;

	double minValue;
	double maxValue;

	double multiplier = 1.0;
	double offset = 0.0;

	int intMinValue = 0;
	int intMaxValue = 1000000;

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		slider.setEnabled(enabled);
		spinner.setEnabled(enabled);
	}
	
	@Override
	protected void setCurrentVerifiedValue(Object verifiedValue) {
		currentValue = (Double) verifiedValue;

		((SpinnerNumberModel) spinner.getModel()).setValue(currentValue);
		slider.setValue(getIntValue(currentValue));
	}

	int getIntValue(double value) {
		return MathUtils.clampInt((int) (multiplier * (value + offset)),
				intMinValue, intMaxValue);
	}

	double getDoubleValue(int intValue) {
		double value = (intValue / multiplier) - offset;
		return MathUtils.clamp(value, minValue, maxValue);
	}

	@Override
	public Object getCurrentValue() {
		return currentValue;
	}

	public DoubleSliderSpinnerWithLabel(String propertyName, String labelText,
			double startValue, double minValue, double maxValue,
			double stepValue) {
		super(propertyName);
		this.minValue = minValue;
		this.maxValue = maxValue;

		if (labelText != null) {
			label = new JLabel(labelText);
			label.setAlignmentY(0.5f);
			add(label);
		}
		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));

		// Find a good multiplier
		double span = maxValue - minValue;
		offset = -minValue;
		multiplier = intMaxValue / span;

		int currentIntValue = getIntValue(startValue);

		currentValue = MathUtils.clamp(startValue, minValue, maxValue);

		spinner = new JSpinner(new SpinnerNumberModel(currentValue, minValue,
				maxValue, stepValue));
		spinner.setMaximumSize(new Dimension(50, 30));
		spinner.setAlignmentY(0.5f);

		spinner.addChangeListener(new ChangeListener() {
			@Override
			public void stateChanged(ChangeEvent e) {
				double oldValue = currentValue;
				currentValue = (Double) ((SpinnerNumberModel) spinner
						.getModel()).getValue();
				informAllListeners(oldValue, currentValue);
				int sliderValue = slider.getValue();
				if (sliderValue != currentValue) {
					slider.setValue(getIntValue(currentValue));
				}
			}
		});

		slider = new JSlider(intMinValue, intMaxValue, currentIntValue);
		// slider.setMinorTickSpacing(arg0)

		slider.addChangeListener(new ChangeListener() {
			@Override
			public void stateChanged(ChangeEvent e) {
				int oldValue = getIntValue(currentValue);
				currentValue = getDoubleValue(slider.getValue());
				informAllListeners(oldValue, currentValue);
				double spinnerValue = (Double) ((SpinnerNumberModel) spinner
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

}
