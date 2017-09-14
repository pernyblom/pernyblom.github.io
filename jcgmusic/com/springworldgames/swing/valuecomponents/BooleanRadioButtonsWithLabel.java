package com.springworldgames.swing.valuecomponents;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JLabel;
import javax.swing.JRadioButton;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

public class BooleanRadioButtonsWithLabel extends ValueComponent {

	boolean currentValue = false;

	JLabel label;
	JRadioButton trueButton;
	JRadioButton falseButton;

	@Override
	protected void setCurrentVerifiedValue(Object verifiedValue) {
		currentValue = (Boolean) verifiedValue;
		trueButton.setSelected(currentValue);
		falseButton.setSelected(!currentValue);
	}

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		trueButton.setEnabled(enabled);
		falseButton.setEnabled(enabled);
	}

	public BooleanRadioButtonsWithLabel(String propertyName, String labelText,
			boolean startValue) {
		super(propertyName);
		currentValue = startValue;

		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
		if (labelText != null) {
			label = new JLabel(labelText);
			label.setAlignmentX(0.0f);
			add(label);
		}

		ButtonGroup group = new ButtonGroup();
		trueButton = new JRadioButton("True", currentValue);
		trueButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				boolean oldValue = currentValue;
				if (trueButton.isSelected()) {
					currentValue = true;
				}
				if (falseButton.isSelected()) {
					currentValue = false;
				}
				if (currentValue != oldValue) {
					informAllListeners(oldValue, currentValue);
				}
			}
		});
//		trueButton.addChangeListener(new ChangeListener() {
//			@Override
//			public void stateChanged(ChangeEvent arg0) {
//			}
//		});

		group.add(trueButton);

		falseButton = new JRadioButton("False", !currentValue);
		falseButton.addChangeListener(new ChangeListener() {
			@Override
			public void stateChanged(ChangeEvent arg0) {
				boolean oldValue = currentValue;
				if (trueButton.isSelected()) {
					currentValue = true;
				}
				if (falseButton.isSelected()) {
					currentValue = false;
				}
				informAllListeners(oldValue, currentValue);
			}
		});
		group.add(falseButton);

		trueButton.setAlignmentX(1.0f);
		falseButton.setAlignmentX(1.0f);

		add(Box.createHorizontalGlue());

		add(trueButton);
		add(falseButton);
	}

	@Override
	public Object getCurrentValue() {
		return currentValue;
	}

	public void setCurrentValue(boolean v) {
		currentValue = v;
	}

}
