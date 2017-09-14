package com.springworldgames.swing.valuecomponents;

import javax.swing.DefaultButtonModel;
import javax.swing.JButton;



public class DoublePushButton extends ValueComponent {

	double upValue = 0.0;
	double downValue = 1.0;

	double currentValue = 0.0;
	
	public DoublePushButton(String propertyName, String text,
			final double upValue, final double downValue) {
		super(propertyName);
		this.upValue = upValue;
		this.downValue = downValue;
	
		currentValue = upValue;
		
		JButton button = new JButton(text);

		button.setModel(new DefaultButtonModel() {
			@Override
			public void setPressed(boolean b) {
				if (b) {
					informAllListeners(upValue, downValue);
					currentValue = downValue;
				} else {
					informAllListeners(downValue, upValue);
					currentValue = upValue;
				}
				super.setPressed(b);
			}
		});
		add(button);
	}

	@Override
	public Object getCurrentValue() {
		return currentValue;
	}
	
}
