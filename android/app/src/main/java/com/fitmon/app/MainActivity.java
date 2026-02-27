package com.fitmon.app;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.card.MaterialCardView;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        SharedPreferences prefs = getSharedPreferences("FitMon", MODE_PRIVATE);
        String username = prefs.getString("username", "User");

        TextView tvWelcome = findViewById(R.id.tvWelcome);
        tvWelcome.setText("Good Day, " + username);

        MaterialCardView cardWorkouts = findViewById(R.id.cardWorkouts);
        MaterialCardView cardProfile = findViewById(R.id.cardProfile);

        cardWorkouts.setOnClickListener(v -> 
            startActivity(new Intent(this, WorkoutsActivity.class)));

        cardProfile.setOnClickListener(v -> 
            startActivity(new Intent(this, ProfileActivity.class)));

        setupBottomNav();
    }

    private void setupBottomNav() {
        BottomNavigationView bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setSelectedItemId(R.id.nav_home);
        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_workouts) {
                startActivity(new Intent(this, WorkoutsActivity.class));
                return true;
            } else if (id == R.id.nav_profile) {
                startActivity(new Intent(this, ProfileActivity.class));
                return true;
            }
            return true;
        });
    }
}
