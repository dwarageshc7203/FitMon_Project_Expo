package com.fitmon.app;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.widget.TextView;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class WorkoutsActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_workouts);

        getSupportActionBar().setTitle("Workouts");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        // Mock workout data
        List<String> workouts = Arrays.asList(
            "Push-ups", "Squats", "Lunges", "Planks", 
            "Burpees", "Mountain Climbers", "Jumping Jacks",
            "Sit-ups", "Leg Raises", "Pull-ups"
        );

        TextView tvWorkoutCount = findViewById(R.id.tvWorkoutCount);
        tvWorkoutCount.setText(workouts.size() + " Workouts Available");
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}
