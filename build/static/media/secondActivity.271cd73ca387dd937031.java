package com.example.second;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;
import android.widget.TextView;

public class secondActivity extends Activity{
	int score=0;
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        Button button = (Button)findViewById(R.id.button1);
        TextView textView = (TextView)findViewById(R.id.textView1);
        textView.setText(Integer.toString(score));
        button.setOnClickListener(new Button.OnClickListener() {
            public void onClick(View v) {
            	score = score + 1;
            	TextView textView = (TextView)findViewById(R.id.textView1);
                textView.setText(Integer.toString(score));
                Toast.makeText(secondActivity.this, R.string.hello,
                    Toast.LENGTH_SHORT).show();
                
                
            }
           
        }); 
       
    }
    
 }