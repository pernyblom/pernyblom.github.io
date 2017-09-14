package com.springworldgames.swing.valuecomponents;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.MouseListener;
import java.util.LinkedHashSet;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

public class StringTextfieldWithLabel extends ValueComponent {

	String currentValue = "";

	JLabel label;
	JTextField tf;

	Color origBackground;

	LinkedHashSet<String> forbiddenValues = new LinkedHashSet<String>();
	
	@Override
	protected void setCurrentVerifiedValue(Object verifiedValue) {
		currentValue = (String) verifiedValue;
		tf.setText(currentValue);
	}
	
	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		tf.setEnabled(enabled);
	}
	
	public StringTextfieldWithLabel(String propertyName, String labelText,
			String startValue) {
		super(propertyName);
		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));

		if (labelText != null) {
			label = new JLabel(labelText);
			label.setAlignmentX(0.0f);
			add(label);
		}
		tf = new JTextField("" + startValue, 10);
		tf.setAlignmentX(1.0f);
		tf.setMaximumSize(new Dimension(200, 30));

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

	public void addForbiddenValues(String... values) {
		for (String s : values) {
			forbiddenValues.add(s);
		}
	}
	
	public void setForbiddenValues(String... values) {
		forbiddenValues.clear();
		addForbiddenValues(values);
	}
	
	public void validateText() {
		String text = tf.getText();

		errors = new StringBuilder();
		warnings = new StringBuilder();
		try {
			setIfValid(text, false);
		} catch (NumberFormatException e) {
			tf.setBackground(Color.red);
		}
	}

	private void setIfValid(String testValue) {
		setIfValid(testValue, false);
	}

	@Override
	protected boolean valueIsValid(Object value, StringBuilder errors,
			StringBuilder warnings) {
		String s = (String) value;
		if (forbiddenValues.contains(s)) {
			return false;
		}
		return super.valueIsValid(value, errors, warnings);
	}
	
	private void setIfValid(String testValue, boolean force) {
		if (valueIsValid(testValue, errors, warnings)) {
			String oldValue = currentValue;
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

	@Override
	public void addMouseListenerForAllInputComponents(MouseListener l) {
		tf.addMouseListener(l);
	}
	
}
