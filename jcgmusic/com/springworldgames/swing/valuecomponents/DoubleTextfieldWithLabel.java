package com.springworldgames.swing.valuecomponents;

import java.awt.Color;
import java.awt.Dimension;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

public class DoubleTextfieldWithLabel extends ValueComponent {

	double currentValue = 0.0;

	JLabel label;
	JTextField tf;

	Color origBackground;

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		tf.setEnabled(enabled);
	}
	
	@Override
	protected void setCurrentVerifiedValue(Object verifiedValue) {
		currentValue = (Double) verifiedValue;
		tf.setText("" + currentValue);
	}
	
	public DoubleTextfieldWithLabel(String propertyName, String labelText,
			double startValue) {
		super(propertyName);
		
//		setPreferredSize(new Dimension(200, 30));
		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
		// setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
		if (labelText != null) {
			label = new JLabel(labelText);
			add(label);
			label.setAlignmentX(0.0f);
		}
		tf = new JTextField("" + startValue, 10);
		tf.setAlignmentX(1.0f);
		tf.setPreferredSize(new Dimension(50, 30));
		tf.setMaximumSize(new Dimension(50, 30));
		tf.getDocument().addDocumentListener(new DocumentListener() {
			public void changedUpdate(DocumentEvent e) {
				validateText();
			}

			public void removeUpdate(DocumentEvent e) {
				validateText();
			}

			public void insertUpdate(DocumentEvent e) {
				validateText();
			}
		});

		origBackground = tf.getBackground();
		add(Box.createHorizontalGlue());
		add(tf);
	}

	public void validateText() {
		String text = tf.getText();

		errors = new StringBuilder();
		warnings = new StringBuilder();
		try {
			double testValue = Double.parseDouble(text);
			setIfValid(testValue, false);
		} catch (NumberFormatException e) {
			tf.setBackground(Color.red);
		}
	}

	private void setIfValid(double testValue) {
		setIfValid(testValue, false);
	}

	private void setIfValid(double testValue, boolean force) {
		if (valueIsValid(testValue, errors, warnings)) {
			double oldValue = currentValue;
			currentValue = testValue;
			tf.setBackground(origBackground);
			informAllListeners(oldValue, currentValue);
		} else {
			tf.setBackground(Color.red);
		}
	}

	@Override
	public Object getCurrentValue() {
		return currentValue;
	}

	public void setCurrentValue(double v, boolean force) {
		setIfValid(v, force);
	}

	public void setCurrentValue(double v) {
		setIfValid(v);
	}

}
