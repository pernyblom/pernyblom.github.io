package com.springworldgames.swing.valuecomponents;

import java.awt.Color;
import java.awt.Dimension;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

public class IntegerTextfieldWithLabel extends ValueComponent {

	int currentValue = 0;

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
		currentValue = (Integer) verifiedValue;
		tf.setText("" + currentValue);
	}
	
	public IntegerTextfieldWithLabel(String propertyName, String labelText,
			int startValue) {
		super(propertyName);
		currentValue = startValue;
		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
		if (labelText != null) {
			label = new JLabel(labelText);
			label.setAlignmentX(0.0f);
			add(label);
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
			int testValue = Integer.parseInt(text);
			setIfValid(testValue, false);
		} catch (NumberFormatException e) {
			tf.setBackground(Color.red);
		}
	}

	private void setIfValid(int testValue) {
		setIfValid(testValue, false);
	}

	private void setIfValid(int testValue, boolean force) {
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

	public void setCurrentValue(int v, boolean force) {
		setIfValid(v, force);
	}

	public void setCurrentValue(int v) {
		setIfValid(v);
	}

}
