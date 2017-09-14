package com.springworldgames.swing.valuecomponents;

import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.util.LinkedHashMap;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JComboBox;
import javax.swing.JLabel;

public class EnumerableComboboxWithLabel extends ValueComponent {

	Object currentValue;

	JLabel label;
	JComboBox cb;

	LinkedHashMap<Object, String> valueNameMap = new LinkedHashMap<Object, String>();
	LinkedHashMap<String, Object> nameValueMap = new LinkedHashMap<String, Object>();

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		cb.setEnabled(enabled);
	}
	
	@Override
	protected void setCurrentVerifiedValue(Object verifiedValue) {
		currentValue = verifiedValue;
		String string = valueNameMap.get(currentValue);
		cb.setSelectedItem(string);
	}
	
	public EnumerableComboboxWithLabel(String propertyName, String labelText,
			Object startValue, Object[] values, String[] names) {
		super(propertyName);
		setPreferredSize(new Dimension(200, 30));
		setMaximumSize(new Dimension(500, 30));

		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
		for (int i = 0; i < values.length; i++) {
			valueNameMap.put(values[i], names[i]);
			nameValueMap.put(names[i], values[i]);
		}

		if (labelText != null) {
			label = new JLabel(labelText);
			add(label);
			label.setAlignmentX(0.0f);
		}

		currentValue = startValue;

		cb = new JComboBox(names);
		// cb.setPreferredSize(new Dimension(50, 20));
		cb.setAlignmentX(1.0f);
		cb.setMaximumRowCount(Math.min(25, values.length));
		cb.setSelectedItem(valueNameMap.get(startValue));
		cb.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				Object oldValue = currentValue;
				String selectedItem = (String) cb.getSelectedItem();
				if (selectedItem != null) {
					currentValue = nameValueMap.get(selectedItem);
					informAllListeners(oldValue, currentValue);
				}
			}
		});
//		cb.addItemListener(new ItemListener() {
//
//			@Override
//			public void itemStateChanged(ItemEvent e) {
//				Object oldValue = currentValue;
//				String selectedItem = (String) cb.getSelectedItem();
//				if (selectedItem != null) {
//					currentValue = nameValueMap.get(selectedItem);
//					informAllListeners(oldValue, currentValue);
//				}
//			}
//		});
		add(Box.createHorizontalGlue());
		add(cb);
	}

	public Object getCurrentValue() {
		return currentValue;
	}

}
