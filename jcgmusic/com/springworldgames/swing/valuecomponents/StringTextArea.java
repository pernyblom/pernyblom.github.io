package com.springworldgames.swing.valuecomponents;

import java.awt.Color;
import java.awt.Dimension;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;



public class StringTextArea extends ValueComponent {

	String currentValue = "";

	JLabel label;
	JTextArea textArea;

	Color origBackground;

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		textArea.setEnabled(enabled);
	}
	
	@Override
	protected void setCurrentVerifiedValue(Object verifiedValue) {
		textArea.setText(verifiedValue.toString());
		currentValue = textArea.getText();
	}
	
	public StringTextArea(String propertyName, String captionText,
			String startValue) {
		super(propertyName);
		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));

		if (captionText != null) {
			setBorder(BorderFactory.createTitledBorder(captionText));
		}
		
		textArea = new JTextArea(startValue, 1, 10);

		JScrollPane sp = new JScrollPane(textArea);
//		sp.setMaximumSize(new Dimension(200, 200));
		sp.setMinimumSize(new Dimension(100, 80));
		
		textArea.getDocument().addDocumentListener(new DocumentListener() {
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

		origBackground = textArea.getBackground();
		add(sp);
	}

	public void validateText() {
		String text = textArea.getText();

		errors = new StringBuilder();
		warnings = new StringBuilder();
		try {
			setIfValid(text, false);
		} catch (NumberFormatException e) {
			textArea.setBackground(Color.red);
		}
	}

	private void setIfValid(String testValue) {
		setIfValid(testValue, false);
	}

	private void setIfValid(String testValue, boolean force) {
		if (valueIsValid(testValue, errors, warnings)) {
			String oldValue = currentValue;
			currentValue = testValue;
			textArea.setBackground(origBackground);
			informAllListeners(oldValue, currentValue);
		} else {
			textArea.setBackground(Color.red);
		}
	}

	@Override
	public Object getCurrentValue() {
		return currentValue;
	}
	
}
