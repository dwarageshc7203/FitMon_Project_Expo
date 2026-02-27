package com.fitmon.app;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class    LandingActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_landing);

        Button btnGetStarted = findViewById(R.id.btnGetStarted);
        Button btnSignIn = findViewById(R.id.btnSignIn);

        btnGetStarted.setOnClickListener(v -> {
            startActivity(new Intent(this, SignupActivity.class));
        });

        btnSignIn.setOnClickListener(v -> {
            startActivity(new Intent(this, LoginActivity.class));
        });
    }
}
