package com.springworldgames.swing.valuecomponents;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JToggleButton;

public class DoubleToggleButton extends ValueComponent {

	double upValue = 0.0;
	double downValue = 1.0;

	double currentValue;
	private JToggleButton button;
	
	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		button.setEnabled(enabled);
	}
	
	@Override
	public Object getCurrentValue() {
		return currentValue;
	}
	
	public DoubleToggleButton(String propertyName, String text, boolean toggled,
			final double upValue, final double downValue) {
		super(propertyName);
		this.upValue = upValue;
		this.downValue = downValue;

		button = new JToggleButton(text, toggled);

		button.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				boolean selected = button.isSelected();
				if (selected) {
					informAllListeners(upValue, downValue);
					currentValue = downValue;
				} else {
					informAllListeners(downValue, upValue);
					currentValue = upValue;
				}
			}
		});

		add(button);
	}

	
}
