package com.springworldgames.swing.valuecomponents;

import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;

public class PFAContainerValueComponentDialog extends JDialog implements
		ActionListener {

	ArrayList<JButton> buttons = new ArrayList<JButton>();
	private int buttonIndex = -1;

	public PFAContainerValueComponentDialog(
			PFAContainerValueComponent component, String... buttonTexts) {
		super((JFrame) null, "Edit", true);
		setResizable(true);

		Dimension preferredSize = component.getPreferredSize();
		setSize(preferredSize.width + 100, Math.min(600, preferredSize.height + 100));

		JPanel mainPanel = new JPanel();
		mainPanel.setLayout(new BoxLayout(mainPanel, BoxLayout.Y_AXIS));
		add(mainPanel);

		JScrollPane scrollPane = new JScrollPane(component);
		mainPanel.add(scrollPane);

		JPanel buttonPanel = new JPanel();
		buttonPanel.setLayout(new BoxLayout(buttonPanel, BoxLayout.X_AXIS));
		mainPanel.add(buttonPanel);

		
		if (buttonTexts.length == 0) {
			JButton closeButton = new JButton("Close");
			closeButton.addActionListener(this);
			buttonPanel.add(closeButton);
			getRootPane().setDefaultButton(closeButton);
			buttons.add(closeButton);
		} else {
			for (String buttonText : buttonTexts) {
				JButton button = new JButton(buttonText);
				button.addActionListener(this);
				buttonPanel.add(button);
				buttons.add(button);
			}
		}
		
	}

	public void actionPerformed(ActionEvent e) {
		int buttonIndex = 0;
		for (JButton b : buttons) {
			if (e.getSource() == b) {
				this.buttonIndex = buttonIndex;
			}
			buttonIndex++;
		}
		setVisible(false);
	}

	public int getButtonIndex() {
		return buttonIndex;
	}
	
	@Override
	public void setVisible(boolean v) {
		if (v) {
			buttonIndex = -1;
		}
		super.setVisible(v);
	}

}
