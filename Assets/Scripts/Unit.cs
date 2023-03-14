using UnityEngine;

public class Unit : MonoBehaviour
{
    [SerializeField] private GameObject selectedIndicator;

    private void Awake()
    {
        Deselect();
    }

    public void Select()
    {
        selectedIndicator.SetActive(true);
    }

    public void Deselect()
    {
        selectedIndicator.SetActive(false);
    }
}
